import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMovieController } from '../hooks/useMovieController';
import { useTranslation } from '../context/TranslationContext';
import './MovieForm.css';

export default function MovieForm({ isEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentMovie, loading, error, fetchMovieDetail, createMovie, editMovie, resetCurrentMovie } = useMovieController();
  const { t } = useTranslation();

  // Initial Form State
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    description: '',
    originalPrice: '',
    currentPrice: '',
    rating: '',
    releaseYear: '',
    image: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If editing, fetch movie details
  useEffect(() => {
    if (isEdit && id) {
      fetchMovieDetail(id);
    } else {
      resetCurrentMovie();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: '',
        genre: '',
        description: '',
        originalPrice: '',
        currentPrice: '',
        rating: '',
        releaseYear: '',
        image: '',
      });
    }
  }, [id, isEdit, fetchMovieDetail, resetCurrentMovie]);

  // Populate form if editing
  useEffect(() => {
    if (isEdit && currentMovie && currentMovie.id === id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: currentMovie.title || '',
        genre: currentMovie.genre || '',
        description: currentMovie.description || '',
        originalPrice: currentMovie.originalPrice?.toString() || '',
        currentPrice: currentMovie.currentPrice?.toString() || '',
        rating: currentMovie.rating?.toString() || '',
        releaseYear: currentMovie.releaseYear?.toString() || '',
        image: currentMovie.image || '',
      });
    }
  }, [currentMovie, isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error on change
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const urlPattern = /^(https?:\/\/|\/)[^\s/$.?#].[^\s]*$/i;

    if (!formData.title.trim()) {
      errors.title = t('errTitleReq');
    } else if (formData.title.trim().length < 2) {
      errors.title = t('errTitleLen');
    }

    if (!formData.genre.trim()) {
      errors.genre = t('errGenreReq');
    }

    if (!formData.image.trim()) {
      errors.image = t('errImageReq');
    } else if (!urlPattern.test(formData.image.trim())) {
      errors.image = t('errImageInvalid');
    }

    if (!formData.description.trim()) {
      errors.description = t('errPlotReq');
    } else if (formData.description.trim().length < 10) {
      errors.description = t('errPlotLen');
    }

    const year = parseInt(formData.releaseYear);
    if (!formData.releaseYear) {
      errors.releaseYear = t('errYearReq');
    } else if (isNaN(year) || year < 1888 || year > new Date().getFullYear() + 5) {
      errors.releaseYear = t('errYearInvalid');
    }

    const ratingVal = parseFloat(formData.rating);
    if (!formData.rating) {
      errors.rating = t('errRatingReq');
    } else if (isNaN(ratingVal) || ratingVal < 0 || ratingVal > 10) {
      errors.rating = t('errRatingInvalid');
    }

    const origPriceVal = parseFloat(formData.originalPrice);
    if (!formData.originalPrice) {
      errors.originalPrice = t('errOrigPriceReq');
    } else if (isNaN(origPriceVal) || origPriceVal < 0) {
      errors.originalPrice = t('errOrigPriceInvalid');
    }

    const currPriceVal = parseFloat(formData.currentPrice);
    if (!formData.currentPrice) {
      errors.currentPrice = t('errCurrPriceReq');
    } else if (isNaN(currPriceVal) || currPriceVal < 0) {
      errors.currentPrice = t('errCurrPriceInvalid');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const formattedData = {
      ...formData,
      originalPrice: parseFloat(formData.originalPrice),
      currentPrice: parseFloat(formData.currentPrice),
      rating: parseFloat(formData.rating),
      releaseYear: parseInt(formData.releaseYear),
    };

    try {
      if (isEdit) {
        await editMovie(id, formattedData);
        setIsSubmitting(false);
        navigate(`/movies/${id}`);
      } else {
        const newMovie = {
          id: Date.now().toString(),
          ...formattedData,
        };
        await createMovie(newMovie);
        setIsSubmitting(false);
        navigate('/movies');
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  if (isEdit && loading && !formData.title) {
    return (
      <div className="form-loading-container">
        <div className="spinner"></div>
        <p>{t('formLoading')}</p>
      </div>
    );
  }

  return (
    <div className="movie-form-page container-small">
      <Link to={isEdit ? `/movies/${id}` : '/movies'} className="back-link">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t('formCancel')}
      </Link>

      <div className="form-card">
        <h1 className="form-title">{isEdit ? t('formEditTitle') : t('formAddTitle')}</h1>
        <p className="form-subtitle">
          {isEdit ? t('formEditSubtitle') : t('formAddSubtitle')}
        </p>

        {error && (
          <div className="error-banner">
            <strong>{t('errSystemError')}</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="crud-form" noValidate>
          <div className="form-group">
            <label htmlFor="title">{t('formLabelTitle')} <span className="req">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t('formPlaceholderTitle')}
              className={`form-input ${formErrors.title ? 'is-invalid' : ''}`}
            />
            {formErrors.title && <span className="field-error">{formErrors.title}</span>}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="genre">{t('formLabelGenre')} <span className="req">*</span></label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                list="genres-list"
                placeholder={t('formPlaceholderGenre')}
                className={`form-input ${formErrors.genre ? 'is-invalid' : ''}`}
              />
              <datalist id="genres-list">
                <option value="Action" />
                <option value="Sci-Fi" />
                <option value="Thriller" />
                <option value="Comedy" />
                <option value="Drama" />
                <option value="Fantasy" />
                <option value="Animation" />
                <option value="Romance" />
                <option value="Horror" />
              </datalist>
              {formErrors.genre && <span className="field-error">{formErrors.genre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="releaseYear">{t('formLabelYear')} <span className="req">*</span></label>
              <input
                type="number"
                id="releaseYear"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                placeholder={t('formPlaceholderYear')}
                className={`form-input ${formErrors.releaseYear ? 'is-invalid' : ''}`}
              />
              {formErrors.releaseYear && <span className="field-error">{formErrors.releaseYear}</span>}
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="rating">{t('formLabelRating')} <span className="req">*</span></label>
              <input
                type="number"
                step="0.1"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder={t('formPlaceholderRating')}
                className={`form-input ${formErrors.rating ? 'is-invalid' : ''}`}
              />
              {formErrors.rating && <span className="field-error">{formErrors.rating}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="image">{t('formLabelImage')} <span className="req">*</span></label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder={t('formPlaceholderImage')}
                className={`form-input ${formErrors.image ? 'is-invalid' : ''}`}
              />
              {formErrors.image && <span className="field-error">{formErrors.image}</span>}
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="originalPrice">{t('formLabelOrigPrice')} <span className="req">*</span></label>
              <input
                type="number"
                step="0.01"
                id="originalPrice"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder={t('formPlaceholderOrigPrice')}
                className={`form-input ${formErrors.originalPrice ? 'is-invalid' : ''}`}
              />
              {formErrors.originalPrice && <span className="field-error">{formErrors.originalPrice}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="currentPrice">{t('formLabelCurrPrice')} <span className="req">*</span></label>
              <input
                type="number"
                step="0.01"
                id="currentPrice"
                name="currentPrice"
                value={formData.currentPrice}
                onChange={handleChange}
                placeholder={t('formPlaceholderCurrPrice')}
                className={`form-input ${formErrors.currentPrice ? 'is-invalid' : ''}`}
              />
              {formErrors.currentPrice && <span className="field-error">{formErrors.currentPrice}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">{t('formLabelPlot')} <span className="req">*</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder={t('formPlaceholderPlot')}
              className={`form-input form-textarea ${formErrors.description ? 'is-invalid' : ''}`}
            ></textarea>
            {formErrors.description && <span className="field-error">{formErrors.description}</span>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-submit ${isSubmitting ? 'loading' : ''}`}
            >
              {isSubmitting ? t('formBtnSaving') : isEdit ? t('formBtnUpdate') : t('formBtnPublish')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
