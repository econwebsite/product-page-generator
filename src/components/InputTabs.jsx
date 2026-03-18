import React, { useState } from 'react';

const InputTabs = ({ 
  onParseContent, 
  loadTemplate, 
  productData, 
  setProductData,
  content,
  setContent,
  onClearContent,
  onFileUpload,
  isLoading,
  wordFileStructure
}) => {
  const [activeTab, setActiveTab] = useState('paste');
  const [expandedSections, setExpandedSections] = useState({
    specifications: false,
    software: false,
    kitContents: false,
    applications: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleParse = () => {
    if (activeTab === 'paste') {
      onParseContent(content);
    } else if (activeTab === 'form') {
      // Generate content from form data
      let generatedContent = `## ${productData.name} -- ${productData.title}\n\n`;
      
      // Highlights
      generatedContent += `# Highlights\n`;
      productData.highlights.forEach(h => {
        generatedContent += `- ${h}\n`;
      });
      generatedContent += '\n';
      
      // Overview
      generatedContent += `# Overview\n${productData.overview}\n\n`;
      
      // Specifications from text area
      if (productData.specificationsText && productData.specificationsText.trim()) {
        generatedContent += `# Specifications\n`;
        generatedContent += productData.specificationsText + '\n\n';
      }
      
      // Software from text area
      if (productData.softwareText && productData.softwareText.trim()) {
        generatedContent += `# Software\n`;
        generatedContent += productData.softwareText + '\n\n';
      }
      
      // Kit Contents
      if (productData.kitContents && productData.kitContents.length > 0) {
        generatedContent += `# Kit Contents\n`;
        productData.kitContents.forEach(item => {
          generatedContent += `- ${item}\n`;
        });
        generatedContent += '\n';
      }
      
      // Targeted Applications
      if (productData.applications && productData.applications.length > 0) {
        generatedContent += `# Targeted Applications\n`;
        productData.applications.forEach(app => {
          generatedContent += `- ${app}\n`;
        });
        generatedContent += '\n';
      }
      
      onParseContent(generatedContent);
    }
  };

  const handleFileInputChange = (event) => {
    onFileUpload(event);
  };

  // Initialize productData with all fields if they don't exist
  React.useEffect(() => {
    if (!productData.specificationsText) {
      setProductData(prev => ({
        ...prev,
        specificationsText: `# Key Features
- Frame Rate: Streams 8MP @ 70fps, FullHD @ 100fps and HD @ 140fps
- High speed 4-lane MIPI CSI-2 interface
- Standard M12 lens holder for use with customized optics or lenses for various applications
- Lightweight, versatile, and portable multi-board solution

# Interface
- Interface: 4-Lane MIPI CSI-2
- Connector: 22pin FPC connector
- Cable length: 15cm

# Sensor Features
- Sensor: Sony® Pregius S IMX900
- Focus Type: Fixed focus
- Sensor Resolution: 3.2MP
- Chroma: Color
- Shutter Type: Global Shutter
- Optical Format: 1/3.1"
- Output Format: RAW 10-bit/12-bit
- Pixel Size: 2.25 μm x 2.25 μm
- Sensor Active Area: 2064 (H) x 1552 (V)
- Holder: M12 (S-Mount)
- FOV: 111.91°(D), 89.27°(H), 65.03°(V) (with lens provided by e-con)

# Electrical & Mechanical
- Operating voltage: 3.3V +/- 5%
- Operating temperature: -30°C to 70°C
- Typical power consumption: 1.11W
- Size in mm (l x b): 30 x 30 mm

# Miscellaneous
- Compliance: RoHS`
      }));
    }
    if (!productData.softwareText) {
      setProductData(prev => ({
        ...prev,
        softwareText: `e-con Systems provides the sample applications that demonstrates the features of this camera. However, this camera can also be utilized by any V4L2 application.

# Supported Kernel Version
- Renesas RZ/V2H - Kernel 5.10

# Linux camera driver
- V4L2 Linux driver for MIPI CSI-2 camera module:
- Video preview
- Still Image capture
- Camera controls via IOCTLs

Please contact camerasolutions@e-consystems.com for any customization or porting of camera driver to your requirements.`
      }));
    }
    if (!productData.kitContents) {
      setProductData(prev => ({
        ...prev,
        kitContents: []
      }));
    }
    if (!productData.applications) {
      setProductData(prev => ({
        ...prev,
        applications: []
      }));
    }
  }, []);

  return (
    <>
      <ul className="nav nav-tabs" id="inputTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'paste' ? 'active' : ''}`}
            onClick={() => setActiveTab('paste')}
          >
            <i className="fas fa-paste me-1"></i>Paste/Upload Content
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            <i className="fas fa-list-alt me-1"></i>Form Input
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'example' ? 'active' : ''}`}
            onClick={() => setActiveTab('example')}
          >
            <i className="fas fa-eye me-1"></i>File Structure
          </button>
        </li>
      </ul>

      <div className="tab-content mt-3">
        {activeTab === 'paste' && (
          <div className="tab-pane fade show active">
            <div className="mb-3">
              <label className="form-label">Upload Word/Text File or Paste Content:</label>
              
              <div className="mb-3">
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="fileUpload"
                    accept=".doc,.docx,.txt,.pdf"
                    onChange={handleFileInputChange}
                    disabled={isLoading}
                  />
                  <label className="input-group-text" htmlFor="fileUpload">
                    {isLoading ? (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <i className="fas fa-upload"></i>
                    )}
                  </label>
                </div>
                <small className="text-muted">Supported formats: .doc, .docx, .txt, .pdf</small>
              </div>

              <div className="text-center mb-3">
                <span className="mx-2">OR</span>
              </div>

              <textarea
                className="form-control content-area"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                placeholder="Paste your product specification document here or upload a file above..."
                disabled={isLoading}
              />
            </div>
            <button 
              className="btn btn-primary me-2" 
              onClick={handleParse}
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-magic me-1"></i>Parse Content
                </>
              )}
            </button>
            <button 
              className="btn btn-outline-secondary" 
              onClick={onClearContent}
              disabled={isLoading}
            >
              <i className="fas fa-trash me-1"></i>Clear
            </button>
          </div>
        )}

        {activeTab === 'form' && (
          <div className="tab-pane fade show active">
            <div className="row">
              {/* Basic Information */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Product Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={productData.name || ''}
                  onChange={(e) => setProductData({...productData, name: e.target.value})}
                  placeholder="e.g., e-CAM37_CURZH"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Product Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={productData.title || ''}
                  onChange={(e) => setProductData({...productData, title: e.target.value})}
                  placeholder="e.g., 3MP Sony® Pregius S IMX900 Color Camera for Renesas® RZ/V2H"
                />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">Highlights (one per line)</label>
                <textarea
                  className="form-control"
                  value={productData.highlights ? productData.highlights.join('\n') : ''}
                  onChange={(e) => setProductData({...productData, highlights: e.target.value.split('\n').filter(h => h.trim())})}
                  rows={4}
                  placeholder="Each line will become a bullet point"
                />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">Overview</label>
                <textarea
                  className="form-control"
                  value={productData.overview || ''}
                  onChange={(e) => setProductData({...productData, overview: e.target.value})}
                  rows={4}
                  placeholder="Detailed product overview"
                />
              </div>

              {/* Specifications - Single Text Area */}
              <div className="col-12 mb-3">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <i className={`fas fa-chevron-${expandedSections.specifications ? 'down' : 'right'} me-2`} 
                         onClick={() => toggleSection('specifications')} 
                         style={{cursor: 'pointer'}}></i>
                      <span onClick={() => toggleSection('specifications')} style={{cursor: 'pointer'}}>
                        Specifications
                      </span>
                    </h6>
                  </div>
                  {expandedSections.specifications && (
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">
                          Specification Content (Use <b>"#"</b> for sub-headings, <b>"-"</b> for bullet points)
                          <br></br><small className="text-muted ms-2">
                            Example: # Key Features↵- Feature 1↵- Feature 2
                          </small>
                        </label>
                        <textarea
                          className="form-control"
                          value={productData.specificationsText || ''}
                          onChange={(e) => setProductData({
                            ...productData,
                            specificationsText: e.target.value
                          })}
                          rows={12}
                          placeholder={`# Key Features
- Frame Rate: Streams 8MP @ 70fps, FullHD @ 100fps and HD @ 140fps
- High speed 4-lane MIPI CSI-2 interface

# Interface
- Interface: 4-Lane MIPI CSI-2
- Connector: 22pin FPC connector

# Sensor Features
- Sensor: Sony® Pregius S IMX900
- Focus Type: Fixed focus
- Sensor Resolution: 3.2MP
- Chroma: Color
- Shutter Type: Global Shutter

# Electrical & Mechanical
- Operating voltage: 3.3V +/- 5%
- Operating temperature: -30°C to 70°C

# Miscellaneous
- Compliance: RoHS`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Software - Single Text Area */}
              <div className="col-12 mb-3">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <i className={`fas fa-chevron-${expandedSections.software ? 'down' : 'right'} me-2`} 
                         onClick={() => toggleSection('software')} 
                         style={{cursor: 'pointer'}}></i>
                      <span onClick={() => toggleSection('software')} style={{cursor: 'pointer'}}>
                        Software
                      </span>
                    </h6>
                  </div>
                  {expandedSections.software && (
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">
                          Software Content (Use <b>"#"</b> for sub-headings, <b>"-"</b> for bullet points)
                          <br></br><small className="text-muted ms-2">
                            Include contact paragraph at the end
                          </small>
                        </label>
                        <textarea
                          className="form-control"
                          value={productData.softwareText || ''}
                          onChange={(e) => setProductData({
                            ...productData,
                            softwareText: e.target.value
                          })}
                          rows={10}
                          placeholder={`e-con Systems provides the sample applications that demonstrates the features of this camera. However, this camera can also be utilized by any V4L2 application.

# Supported Kernel Version
- Renesas RZ/V2H - Kernel 5.10

# Linux camera driver
- V4L2 Linux driver for MIPI CSI-2 camera module:
- Video preview
- Still Image capture
- Camera controls via IOCTLs

Please contact camerasolutions@e-consystems.com for any customization or porting of camera driver to your requirements.`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Kit Contents - Collapsible Section */}
              <div className="col-12 mb-3">
                <div className="card">
                  <div className="card-header" onClick={() => toggleSection('kitContents')} style={{cursor: 'pointer'}}>
                    <h6 className="mb-0">
                      <i className={`fas fa-chevron-${expandedSections.kitContents ? 'down' : 'right'} me-2`}></i>
                      Kit Contents
                    </h6>
                  </div>
                  {expandedSections.kitContents && (
                    <div className="card-body">
                      <label className="form-label">Kit Items (one per line)</label>
                      <textarea
                        className="form-control"
                        value={productData.kitContents ? productData.kitContents.join('\n') : ''}
                        onChange={(e) => setProductData({
                          ...productData,
                          kitContents: e.target.value.split('\n').filter(k => k.trim())
                        })}
                        rows={4}
                        placeholder="e.g., Camera module, Lens, FPC cable"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Targeted Applications - Collapsible Section */}
              <div className="col-12 mb-3">
                <div className="card">
                  <div className="card-header" onClick={() => toggleSection('applications')} style={{cursor: 'pointer'}}>
                    <h6 className="mb-0">
                      <i className={`fas fa-chevron-${expandedSections.applications ? 'down' : 'right'} me-2`}></i>
                      Targeted Applications
                    </h6>
                  </div>
                  {expandedSections.applications && (
                    <div className="card-body">
                      <label className="form-label">Applications (one per line)</label>
                      <textarea
                        className="form-control"
                        value={productData.applications ? productData.applications.join('\n') : ''}
                        onChange={(e) => setProductData({
                          ...productData,
                          applications: e.target.value.split('\n').filter(a => a.trim())
                        })}
                        rows={4}
                        placeholder="e.g., Machine vision, Robotics, Industrial automation"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="d-flex justify-content-between mt-4">
              <button className="btn btn-outline-secondary" onClick={() => setActiveTab('paste')}>
                <i className="fas fa-arrow-left me-1"></i>Back to Paste
              </button>
              <button className="btn btn-primary" onClick={handleParse}>
                <i className="fas fa-check me-1"></i>Generate & Parse Content
              </button>
            </div>
          </div>
        )}

        {activeTab === 'example' && (
          <div className="tab-pane fade show active">
            <div className="alert alert-info">
              <h5><i className="fas fa-info-circle me-2"></i>Word File Structure Guide</h5>
              <p>Your Word document should follow this exact structure. Copy and paste this into your Word file:</p>
            </div>
            <div className="alert alert-warning">
              <h6><i className="fas fa-exclamation-triangle me-2"></i>Important Notes:</h6>
              <ul className="mb-0">
                <li>Use <strong>##</strong> for product name and title</li>
                <li>Use <strong>#</strong> for section headings</li>
                <li>Use <strong>-</strong> for bullet points</li>
                <li>Maintain the exact heading names shown below</li>
                <li>Save as .docx, .doc, .txt, or .pdf format</li>
              </ul>
            </div>
            <div className="border rounded p-3 bg-light">
              <pre className="mb-0" style={{ 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-word',
                fontSize: '12px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {wordFileStructure}
              </pre>
            </div>
            
            <div className="mt-3">
              <h6>Download Template:</h6>
              <a 
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(wordFileStructure)}`}
                download="product-page-template.txt"
                className="btn btn-outline-primary btn-sm"
              >
                <i className="fas fa-download me-1"></i>Download Template as Text File
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InputTabs;