import React from 'react';

const ConfigurationOptions = ({ config, setConfig, onGenerate }) => {
  const handleChange = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  const handleCheckboxChange = (field) => {
    setConfig({ ...config, [field]: !config[field] });
  };

  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Product Code</label>
        <input
          type="text"
          className="form-control"
          value={config.productCode}
          onChange={(e) => handleChange('productCode', e.target.value)}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Price</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            type="text"
            className="form-control"
            value={config.productPrice}
            onChange={(e) => handleChange('productPrice', e.target.value)}
          />
        </div>
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Image Base Path</label>
        <input
          type="text"
          className="form-control"
          value={config.imagePath}
          onChange={(e) => handleChange('imagePath', e.target.value)}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Theme Color</label>
        <select
          className="form-select"
          value={config.themeColor}
          onChange={(e) => handleChange('themeColor', e.target.value)}
        >
          <option value="#3f4d85">Blue (Default)</option>
          <option value="#28a745">Green</option>
          <option value="#dc3545">Red</option>
          <option value="#6f42c1">Purple</option>
          <option value="#fd7e14">Orange</option>
        </select>
      </div>
      <div className="col-md-12 mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={config.includeCarousel}
            onChange={() => handleCheckboxChange('includeCarousel')}
            id="includeCarousel"
          />
          <label className="form-check-label" htmlFor="includeCarousel">
            Include Image Carousel
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={config.includeSidebar}
            onChange={() => handleCheckboxChange('includeSidebar')}
            id="includeSidebar"
          />
          <label className="form-check-label" htmlFor="includeSidebar">
            Include Applications Sidebar
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={config.responsiveLayout}
            onChange={() => handleCheckboxChange('responsiveLayout')}
            id="responsiveLayout"
          />
          <label className="form-check-label" htmlFor="responsiveLayout">
            Generate Responsive Layout
          </label>
        </div>
      </div>
      <div className="col-md-12">
        <button className="btn btn-success w-100" onClick={onGenerate}>
          Generate Product Page
        </button>
      </div>
    </div>
  );
};

export default ConfigurationOptions;