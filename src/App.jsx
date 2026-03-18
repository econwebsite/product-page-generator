import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import StepIndicator from './components/StepIndicator';
import InputTabs from './components/InputTabs';
import ConfigurationOptions from './components/ConfigurationOptions';
import PreviewArea from './components/PreviewArea';
import Alert from './components/Alert';
import { parseContent } from './utils/templateParser';
import { generateHTML } from './utils/htmlGenerator';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [productData, setProductData] = useState({
    name: '',
    title: '',
    description: '',
    highlights: [],
    overview: '',
    specificationsText: '',
    softwareText: '',
    kitContents: [],
    applications: []
  });
  
  const [config, setConfig] = useState({
    productCode: '',
    productPrice: '1536',
    imagePath: '/images/eCAM/e-CAM37_CURZH/',
    themeColor: '#3f4d85',
    includeCarousel: true,
    includeSidebar: true,
    responsiveLayout: true
  });
  
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (message, type = 'info') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const handleParseContent = (contentToParse) => {
    try {
      const parsed = parseContent(contentToParse);
      setProductData(parsed);
      setConfig(prev => ({ 
        ...prev, 
        productCode: parsed.name || 'e-CAMXX_XXXX',
        imagePath: `/images/eCAM/${parsed.name || 'e-CAMXX_XXXX'}/`
      }));
      setCurrentStep(2);
      showAlert('Content parsed successfully! Configure your options.', 'success');
    } catch (error) {
      showAlert('Error parsing content: ' + error.message, 'danger');
    }
  };

  const handleGenerateHTML = () => {
    try {
      const html = generateHTML(productData, config);
      setGeneratedHTML(html);
      setCurrentStep(3);
      showAlert('HTML generated successfully!', 'success');
    } catch (error) {
      showAlert('Error generating HTML: ' + error.message, 'danger');
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedHTML).then(() => {
      showAlert('HTML copied to clipboard!', 'success');
    });
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([generatedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productData.name || 'product-page'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showAlert('HTML file downloaded!', 'success');
  };

  const loadTemplate = (templateName) => {
    const templates = {
      eCAM37: `## e-CAM37_CURZH -- 3MP Sony® Pregius S IMX900 Color Camera for Renesas® RZ/V2H

# Highlights
- Houses e-CAM315_CUMI900_MOD - 3 MP Camera Module based on Sony® Pregius S™ IMX900 sensor
- Global Shutter
- Plugs directly into the Renesas® RZ/V2H development kit
- High-speed MIPI CSI-2 interface to connect with the CPU

# Overview
e-CAM37_CURZH is a 3MP Global shutter MIPI CSI-2 color camera based on SONY Pregius S IMX900 CMOS image sensor. e-CAM37_CURZH camera consists of a 22-pin FFC connector (CN4), through which it is connected to the Renesas® RZ/V2H development kit using the 15cm 22-pin FFC cable. This camera incorporates global shutter technology, delivering clear, high-quality images even in fast-moving and challenging lighting conditions.

# Specifications
# Key Features
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
- Compliance: RoHS

# Software
e-con Systems provides the sample applications that demonstrates the features of this camera. However, this camera can also be utilized by any V4L2 application.

# Supported Kernel Version
- Renesas RZ/V2H - Kernel 5.10

# Linux camera driver
- V4L2 Linux driver for MIPI CSI-2 camera module:
- Video preview
- Still Image capture
- Camera controls via IOCTLs

Please contact camerasolutions@e-consystems.com for any customization or porting of camera driver to your requirements.

# Kit Contents
- e-CAM315_CUMI900_MOD - 3 MP Sony® Pregius S™ IMX900 MIPI camera module with lens
- Adaptor board
- FPC cable (15cm)

# Targeted Applications
- Barcode Scanners
- Pick and Place robots
- Autonomous mobile robots (AMRs)
- ITS
- Life Science
- Sports Analytics`
    };
    
    if (templates[templateName]) {
      setContent(templates[templateName]);
      showAlert(`Template ${templateName} loaded!`, 'success');
    }
  };

  const handleClearContent = () => {
    setContent('');
    setProductData({
      name: '',
      title: '',
      description: '',
      highlights: [],
      overview: '',
      specificationsText: '',
      softwareText: '',
      kitContents: [],
      applications: []
    });
    setConfig({
      productCode: '',
      productPrice: '1536',
      imagePath: '/images/eCAM/e-CAM37_CURZH/',
      themeColor: '#3f4d85',
      includeCarousel: true,
      includeSidebar: true,
      responsiveLayout: true
    });
    setGeneratedHTML('');
    setCurrentStep(1);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      showAlert('Please upload a Word (.doc, .docx), Text (.txt), or PDF file.', 'danger');
      return;
    }

    setIsLoading(true);

    try {
      let textContent = '';

      if (file.type === 'application/pdf') {
        // For PDF files
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = window.pdfjsLib;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }
        
        textContent = fullText;
      } else if (file.type.includes('word') || file.type.includes('document')) {
        // For Word documents - we'll extract text using a simple method
        // Note: For full Word parsing, you'd need a backend service
        const reader = new FileReader();
        textContent = await new Promise((resolve) => {
          reader.onload = (e) => {
            // Simple text extraction - for .docx files, we can read as text
            if (file.name.endsWith('.docx')) {
              // .docx files are ZIP files, but we can try to read as text
              resolve(e.target.result);
            } else {
              resolve(e.target.result);
            }
          };
          reader.readAsText(file);
        });
      } else {
        // For text files
        textContent = await file.text();
      }

      setContent(textContent);
      showAlert('File uploaded successfully! Now click "Parse Content".', 'success');
    } catch (error) {
      console.error('Error reading file:', error);
      showAlert('Error reading file. Please check the file format.', 'danger');
    } finally {
      setIsLoading(false);
      // Clear file input
      event.target.value = '';
    }
  };

  // Word File Structure Example (static content)
  const wordFileStructure = `# PRODUCT PAGE CONTENT STRUCTURE FOR WORD FILE

Your Word document should follow this structure exactly:

## [Product Code] -- [Product Title]
## e-CAM37_CURZH -- 3MP Sony® Pregius S IMX900 Color Camera for Renesas® RZ/V2H

# Highlights
- [Highlight 1]
- [Highlight 2]
- [Highlight 3]
- [Highlight 4]

# Overview
[Detailed product overview paragraph 1]

[Detailed product overview paragraph 2]

# Specifications
# Key Features
- [Feature 1]
- [Feature 2]
- [Feature 3]
- [Feature 4]

# Interface
- [Interface detail 1]
- [Interface detail 2]
- [Interface detail 3]

# Sensor Features
- Sensor: [Sensor name]
- Focus Type: [Focus type]
- Sensor Resolution: [Resolution]
- Chroma: [Color/Monochrome]
- Shutter Type: [Global/Rolling]
- Optical Format: [Format]
- Output Format: [Format]
- Pixel Size: [Size]
- Sensor Active Area: [Dimensions]
- Holder: [Mount type]
- FOV: [Field of view]

# Electrical & Mechanical
- Operating voltage: [Voltage]
- Operating temperature: [Temperature range]
- Typical power consumption: [Power]
- Size in mm (l x b): [Dimensions]

# Miscellaneous
- Compliance: [Compliance standards]

# Software
[Software description paragraph]

# Supported Kernel Version
- [Kernel version 1]
- [Kernel version 2]

# Linux camera driver
- [Driver feature 1]
- [Driver feature 2]
- [Driver feature 3]

Please contact camerasolutions@e-consystems.com for any customization or porting of camera driver to your requirements.

# Kit Contents
- [Item 1]
- [Item 2]
- [Item 3]

# Targeted Applications
- [Application 1]
- [Application 2]
- [Application 3]
- [Application 4]`;

  return (
    <div className="app-container">
      <header className="header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1> HTML Page Generator</h1>
              <p className="lead mb-0">Automatically generate responsive HTML pages </p>
            </div>
            {/* <div className="col-md-4 text-end">
              <span className="badge bg-light text-dark p-2">React v1.0</span>
            </div> */}
          </div>
        </div>
      </header>

      <main className="container mt-4">
        <StepIndicator currentStep={currentStep} />
        
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-edit me-2"></i>Product Content Input
              </div>
              <div className="card-body">
                <InputTabs 
                  onParseContent={handleParseContent}
                  loadTemplate={loadTemplate}
                  productData={productData}
                  setProductData={setProductData}
                  content={content}
                  setContent={setContent}
                  onClearContent={handleClearContent}
                  onFileUpload={handleFileUpload}
                  isLoading={isLoading}
                  wordFileStructure={wordFileStructure}
                />
              </div>
            </div>
            
            {currentStep >= 2 && (
              <div className="card mb-4">
                <div className="card-header">
                  <i className="fas fa-cog me-2"></i>Page Configuration Options
                </div>
                <div className="card-body">
                  <ConfigurationOptions 
                    config={config}
                    setConfig={setConfig}
                    onGenerate={handleGenerateHTML}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="col-lg-4">
            <PreviewArea 
              generatedHTML={generatedHTML}
              onCopy={handleCopyToClipboard}
              onDownload={handleDownloadHTML}
              showActions={currentStep === 3}
            />
            
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-history me-2"></i>Recent Templates
              </div>
              <div className="card-body">
                <div className="list-group">
                  <button 
                    className="list-group-item list-group-item-action"
                    onClick={() => loadTemplate('eCAM37')}
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">e-CAM37_CURZH</h6>
                      <small>3MP Sony IMX900</small>
                    </div>
                    <p className="mb-1 small">Global Shutter Camera</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Alert alerts={alerts} />
    </div>
  );
}

export default App;