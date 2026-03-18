// src/utils/htmlGenerator.js - FINAL CORRECTED VERSION

/**
 * Escape HTML special characters to prevent XSS
 */
export const escapeHtml = (text) => {
  if (!text) return '';
  
  // First decode any HTML entities
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  const decoded = textArea.value;
  
  // Then escape special characters
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return decoded.replace(/[&<>"']/g, (m) => map[m]);
};
/**
 * Generate CSS styles for responsive design
 */
const generateCSSStyles = (config) => {
  return `
        .primary-color {
            color: ${config.themeColor};
        }
        
        .btn-primary {
            background-color: ${config.themeColor};
            border-color: ${config.themeColor};
        }`;
};

/**
 * Generate specifications HTML with EXACT same bullet style as software tab
 */
/**
 * Generate specifications HTML exactly as in text file
 */
const generateSpecificationsHTML = (specifications) => {
  let html = '';
  
  // Check if specifications exist and have content
  if (!specifications || Object.keys(specifications).length === 0) {
    return '<p class="mediumSize">No specifications found.</p>';
  }
  
  // Generate each specifications section exactly as in text file
  Object.entries(specifications).forEach(([category, items]) => {
    if (items && items.length > 0) {
      // Use the exact same structure
      html += `<ul class="bullet1 mediumSize">`;
      html += `<li><strong>${escapeHtml(category)}:</strong></li>`;
      html += `<li class="nobullet"><ul>`;
      items.forEach(item => {
        html += `<li>${escapeHtml(item)}</li>`;
      });
      html += `</ul></li>`;
      html += `</ul>`;
    }
  });
  
  return html;
};

/**
 * Generate software HTML exactly as in text file
 */
const generateSoftwareHTML = (software) => {
  let html = '';
  
  // Check if software exists and has content
  if (!software || Object.keys(software).length === 0) {
    // Fallback to generic content
    html = `
    <p class="mediumSize">e-con Systems provides sample applications that demonstrate the features of this camera. However, this camera can also be utilized by any V4L2 application.</p>
    <ul class="bullet1 mediumSize">
      <li><strong>Supported Kernel Version:</strong></li>
      <li class="nobullet"><ul>
        <li>Renesas RZ/V2H - Kernel 5.10</li>
      </ul></li>
      <li><strong>Linux camera driver:</strong></li>
      <li class="nobullet"><ul>
        <li>V4L2 Linux driver for MIPI CSI-2 camera module</li>
      </ul></li>
    </ul>
    <p class="mediumSize">Please contact <a href="mailto:camerasolutions@e-consystems.com">camerasolutions@e-consystems.com</a> for any customization or porting of camera driver to your requirements.</p>
    `;
    return html;
  }
  
  // Generate description first (if exists)
  if (software['Description'] && software['Description'].length > 0) {
    const descriptionText = software['Description'].join(' ');
    html += `<p class="mediumSize">${escapeHtml(descriptionText)}</p>`;
  }
  
  // Generate other software sections (excluding Description and Contact)
  Object.entries(software).forEach(([category, items]) => {
    // Skip Description (already handled) and Contact (will handle separately)
    if (category === 'Description' || category === 'Contact') {
      return;
    }
    
    if (items && items.length > 0) {
      // Check if items are bullet points or regular text
      const firstItem = items[0] || '';
      const hasBulletFormat = items.some(item => 
        item.startsWith('-') || item.startsWith('•') || item.startsWith('*') || item.startsWith('o')
      );
      
      if (hasBulletFormat || items.length > 1) {
        // It's a bullet list section
        html += `<ul class="bullet1 mediumSize">`;
        html += `<li><strong>${escapeHtml(category)}:</strong></li>`;
        html += `<li class="nobullet"><ul>`;
        items.forEach(item => {
          // Clean the item (remove any bullet markers)
          const cleanItem = item.replace(/^[-•*o]\s+/, '').trim();
          if (cleanItem) {
            html += `<li>${escapeHtml(cleanItem)}</li>`;
          }
        });
        html += `</ul></li>`;
        html += `</ul>`;
      } else {
        // It's a single text line
        const cleanItem = firstItem.replace(/^[-•*o]\s+/, '').trim();
        html += `<p class="mediumSize"><strong>${escapeHtml(category)}:</strong> ${escapeHtml(cleanItem)}</p>`;
      }
    }
  });
  
  // Add contact information as a paragraph (not as a sub-heading)
  if (software['Contact']) {
    // Extract email from contact line and create mailto link
    const contactText = software['Contact'];
    const emailMatch = contactText.match(/camerasolutions@e-consystems\.com/);
    
    if (emailMatch) {
      const email = emailMatch[0];
      const contactWithoutEmail = contactText.replace(email, '').trim();
      html += `<p class="mediumSize">${escapeHtml(contactWithoutEmail)} <a href="mailto:${email}">${email}</a>${contactText.endsWith('.') ? '' : '.'}</p>`;
    } else {
      html += `<p class="mediumSize">${escapeHtml(contactText)}</p>`;
    }
  } else {
    // Add default contact info if not provided
    html += `<p class="mediumSize">Please contact <a href="mailto:camerasolutions@e-consystems.com">camerasolutions@e-consystems.com</a> for any customization or porting of camera driver to your requirements.</p>`;
  }
  
  return html;
};
/**
 * Generate the complete HTML page
 */
export const generateHTML = (productData, config) => {
  const cssStyles = generateCSSStyles(config);
  const productCode = config.productCode || productData.name || 'e-CAMXX_XXXX';
  const imagePath = config.imagePath.endsWith('/') ? config.imagePath : config.imagePath + '/';
  
  // Generate specifications HTML
  const specsHTML = generateSpecificationsHTML(productData.specifications);
  
  // Generate software HTML
  const softwareHTML = generateSoftwareHTML(productData.software);
  
  // Base template
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>${escapeHtml(productData.name)} - ${escapeHtml(productData.title)}</title>
    <meta name="description" content="${escapeHtml(productData.description || '')}">
    <link rel="alternate" id="en" hreflang="x-default" href="https://www.e-consystems.com/renesas/${productCode.toLowerCase().replace(/_/g, '-')}.asp" />
    <link rel="alternate" id="de" hreflang="de" href="https://www.e-consystems.com/de/renesas/${productCode.toLowerCase().replace(/_/g, '-')}-de.asp" />
    <link rel="alternate" id="ja" hreflang="ja" href="https://www.e-consystems.com/jp/renesas/${productCode.toLowerCase().replace(/_/g, '-')}-jp.asp" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="shortcut icon" href="https://d2u56hfpsewfc3.cloudfront.net/images/econ.ico" />
    <link rel="stylesheet" type="text/css" href="/css/hub-styles-responsive.css" media="all" />
    <link rel="stylesheet" type="text/css" href="/css/responsive.css" />
    <link rel="stylesheet" type="text/css" href="/css/main-style.css" />
    <link rel="stylesheet" type="text/css" href="/css/bootstrap.min-v5.1.3.css" />
    <link rel="stylesheet" type="text/css" href="/css/product-page-css.css?v=1.1" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" type="text/javascript"></script>
    <script src="https://code.jquery.com/jquery-migrate-1.4.1.min.js"></script>
    <script src="https://d2u56hfpsewfc3.cloudfront.net/validation.js" type="text/javascript"></script>
    <script language="javascript">
        function datasheetdownload() {
            var qstr;
            qstr = "/download-form-ecam-hub.asp?download=initial&qdocs=${productCode}-DS,${productCode}-LDS,${productCode}-GSM&pagetitle=${productCode}&paper=spec&TB_iframe=true&modal=true&height=589&width=429";
            self.tb_show("", qstr, "");
            return true;
        }
    </script>
    <style type="text/css">
        /* Responsive Design */
        .evaluate-main {
            float: left;
            width: 100%;
            margin-bottom: 1.5em;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .evaluate-sec {
            float: left;
            width: 30%;
            background-color: transparent;
            height: 200px;
            min-height: 200px;
            box-shadow: rgb(0 0 0 / 2%) 0px 1px 3px 0px, rgb(27 31 35 / 15%) 0px 0px 0px 1px;
            margin: 0 1em 0;
            border-radius: 4px;
            transition: transform 0.3s ease;
        }
        
        .evaluate-sec:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        ${cssStyles}
        
        /* Responsive Media Queries */
        @media only screen and (max-width: 1200px) {
            .evaluate-sec {
                width: 45%;
                margin: 10px;
            }
        }
        
        @media only screen and (max-width: 768px) {
            .evaluate-main {
                flex-direction: column;
                align-items: center;
            }
            
            .evaluate-sec {
                width: 80% !important;
                margin-bottom: 1.5em;
                height: auto;
                min-height: 180px;
                max-height: none;
            }
            
            .product-data {
                padding-top: 6em;
            }
            
            .col-md-6 {
                margin-bottom: 1.5rem;
            }
            
            .nav-tabs {
                flex-wrap: nowrap;
                overflow-x: auto;
                white-space: nowrap;
            }
        }
        
        @media only screen and (max-width: 576px) {
            .evaluate-sec {
                width: 90% !important;
            }
            
            .responsive-tabs .nav-item {
                flex: 1 0 auto;
            }
            
            .responsive-tabs .nav-link {
                font-size: 0.8rem;
                padding: 0.5rem;
            }
            
            .h5 {
                font-size: 1.2rem;
            }
            
            .subtitle {
                font-size: 1rem;
            }
            
            .price-value {
                font-size: 1.5rem;
            }
        }
        
        @media only screen and (max-width: 400px) {
            .evaluate-sec {
                width: 95% !important;
                margin: 0 0 1em 0;
            }
        }
        
        img {
            max-width: 100%;
            height: auto;
        }
        
        .product-data {
            padding-top: 8em;
        }
        
        /* Consistent bullet styling for both software and specifications tabs */
        .bullet1 {
            margin-bottom: 15px;
        }
        
        .bullet1 li strong {
            color: #333;
            font-weight: 600;
            display: block;
            margin-bottom: 5px;
        }
        
        .bullet1 .nobullet ul {
            list-style-type: disc;
            padding-left: 20px;
            margin-top: 5px;
            margin-bottom: 10px;
        }
        
        .bullet1 .nobullet ul li {
            margin-bottom: 5px;
            line-height: 1.4;
            color: #555;
        }
        
        /* Add spacing between specification sections */
        .specifications-section + .specifications-section {
            margin-top: 10px;
        }
        
        /* Software tab specific styling */
        .card-body .bullet1:first-child {
            margin-top: 0;
        }
        
        .card-body .bullet1:last-child {
            margin-bottom: 0;
        }
    </style>
</head>
<body>
    <!-- #include virtual="google-analytics.asp" -->
    <section class="menu">
        <div class="overall-menu" style="background-color: transparent;">
            <!-- #include virtual="header-menu-responsive.asp" -->
        </div>
    </section>
    <section class="product-data">
        <nav aria-label="breadcrumb" id="breadcrumb" style="--bs-breadcrumb-divider: '>';">
            <ol class="breadcrumb mb-2">
                <li class="breadcrumb-item"><a href="/default.asp" title="Go to Home Page" class="smallSize">Home</a></li>
                <li class="breadcrumb-item"><a href="/renesas-cameras.asp#all" title="Renesas Cameras"><span class="smallSize">Renesas Cameras</span></a></li>
                <li class="breadcrumb-item active" aria-current="page"><span class="smallSize">${escapeHtml(productData.title)}</span></li>
            </ol>
        </nav>
        <div class="row align-items-top">
            <div class="col-xl-9">
                <div class="row prd-info">
                    <div class="col-md-12">
                        <h1 class="h5">${escapeHtml(productData.name)} - ${escapeHtml(productData.title)}</h1>
                    </div>`;
  
  // Add carousel if enabled
  if (config.includeCarousel) {
    html += `
                    <div class="col-md-6 col-lg-6">
                        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                            </div>
                            <div class="carousel-inner" id="prd-image">
                                <div class="carousel-item active">
                                    <a href="${imagePath}${productCode.toLowerCase()}-main-zoom.jpg" title="${escapeHtml(productData.name)}" class="d-block mx-auto w-sm-100 w-100">
                                        <img src="${imagePath}${productCode.toLowerCase()}-main-thumb.png" alt="${escapeHtml(productData.name)}" title="${escapeHtml(productData.name)}" class="d-block mx-auto w-sm-100 w-100" style="max-width: 340px" /></a>
                                </div>
                                <div class="carousel-item">
                                    <a href="${imagePath}${productCode.toLowerCase()}-module-zoom.jpg" title="${escapeHtml(productData.name)} Module" class="d-block mx-auto w-sm-100 w-100">
                                        <img src="${imagePath}${productCode.toLowerCase()}-module-thumb.png" alt="${escapeHtml(productData.name)} Module" title="${escapeHtml(productData.name)} Module" class="d-block mx-auto w-sm-100 w-100" style="max-width: 340px" /></a>
                                </div>
                                <div class="carousel-item">
                                    <a href="${imagePath}${productCode.toLowerCase()}-kit-zoom.jpg" title="${escapeHtml(productData.name)} Development Kit" class="d-block mx-auto w-sm-100 w-100">
                                        <img src="${imagePath}${productCode.toLowerCase()}-kit-thumb.png" alt="${escapeHtml(productData.name)} Development Kit" title="${escapeHtml(productData.name)} Development Kit" class="d-block mx-auto w-sm-100 w-100" style="max-width: 340px"></a>
                                </div>
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>`;
  }
  
  html += `
                    <div class="${config.includeCarousel ? 'col-md-6 col-lg-6' : 'col-md-12'}">
                        <div class="product-details">
                            <p class="subtitle mediumSize">Highlights</p>
                            <ul class="product-spec mediumSize">`;
  
  // Add highlights
  productData.highlights.forEach(highlight => {
    html += `<li>${escapeHtml(highlight)}</li>`;
  });
  
  html += `
                            </ul>
                            <hr class="spearate-line">
                            <div class="row d-lg-flex">
                                <div class="col-md-6 col-xl-6">
                                    <div class="purchase-section">
                                        <p class="subtitle mediumSize title-capitalize">Sample Price</p>
                                        <p class="price-value productPrice" data-value="${config.productPrice}">$${config.productPrice}</p>
                                        <div class="price-btn buyNowButton">
                                            <a href="/order-now/${productCode.toLowerCase()}.asp#${productCode}" id="Buynow-btn">
                                                <img src="/images/buynow-btn.png" alt="buy now">
                                            </a>
                                        </div>
                                        <p class="shipment-charge smallSize">Excluding Shipment Charges</p>
                                    </div>
                                </div>
                                <div class="col-md-6 col-xl-6 d-lg-flex flex-lg-column justify-content-lg-end">
                                    <div class="downloads-section" style="margin-bottom: 1.55em;">
                                        <p class="subtitle mediumSize">Documents</p>
                                        <div class="document-btn">
                                            <a onclick="javascript: datasheetdownload();" id="Download-datasheet">
                                                <img src="/images/download-btn.png" alt="Download Document">
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-lg-12">
                        <div class="responsive-tabs custom-tab-8">
                            <ul class="nav nav-tabs nav-pills" role="tablist">
                                <li class="nav-item">
                                    <a id="tab-overview" href="#overview" class="nav-link active text-wrap" data-bs-toggle="tab" role="tab">Overview</a>
                                </li>
                                <li class="nav-item">
                                    <a id="tab-specification" href="#specification" class="nav-link text-wrap" data-bs-toggle="tab" role="tab">Specifications</a>
                                </li>
                                <li class="nav-item">
                                    <a id="tab-software" href="#software" class="nav-link text-wrap" data-bs-toggle="tab" role="tab">Software</a>
                                </li>
                                <li class="nav-item">
                                    <a id="tab-documents" href="#documents" class="nav-link text-wrap documents" data-bs-toggle="tab" role="tab">Documents</a>
                                </li>
                                <li class="nav-item">
                                    <a id="tab-customization" href="#customization" class="nav-link text-wrap" data-bs-toggle="tab" role="tab">Kit Contents</a>
                                </li>
                            </ul>
                            <div id="content" class="tab-content" role="tablist">
                                <div id="overview" class="card tab-pane fade show active" role="tabpanel">
                                    <div class="card-header" role="tab">
                                        <h6 class="mb-0">
                                            <a class="accordion-button collapsed" data-bs-toggle="collapse" href="#collapse-overview">Overview</a>
                                        </h6>
                                    </div>
                                    <div id="collapse-overview" class="collapse show">
                                        <div class="card-body mediumSize">
                                            <p>${escapeHtml(productData.overview)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div id="specification" class="card tab-pane fade" role="tabpanel">
                                    <div class="card-header" role="tab">
                                        <h6 class="mb-0">
                                            <a class="accordion-button collapsed" data-bs-toggle="collapse" href="#collapse-specification">Specifications</a>
                                        </h6>
                                    </div>
                                    <div id="collapse-specification" class="collapse">
                                        <div class="card-body">
                                            ${specsHTML}
                                        </div>
                                    </div>
                                </div>
                                <div id="software" class="card tab-pane fade" role="tabpanel">
                                    <div class="card-header" role="tab">
                                        <h6 class="mb-0">
                                            <a class="accordion-button collapsed" data-bs-toggle="collapse" href="#collapse-software">Software</a>
                                        </h6>
                                    </div>
                                    <div id="collapse-software" class="collapse">
                                        <div class="card-body">
                                            ${softwareHTML}
                                        </div>
                                    </div>
                                </div>
                                <div id="documents" class="card tab-pane fade" role="tabpanel">
                                    <div class="card-header" role="tab">
                                        <h6 class="mb-0">
                                            <a class="accordion-button collapsed" data-bs-toggle="collapse" href="#collapse-documents">Documents</a>
                                        </h6>
                                    </div>
                                    <div id="collapse-documents" class="collapse">
                                        <div class="card-body">
                                            <form action='' method='POST' name="frmdwn">
                                                <div class="doc-lef mediumSize">
                                                    <h6>&nbsp;<img src="/images/list-icon.png" alt="Bullet Arrow">&nbsp;&nbsp;Datasheet</h6>
                                                    <div class="form-check ms-4 d-flex align-items-center">
                                                        <input type="checkbox" name="interested" id="option1" value="${productCode}-DS" class="form-check-input productDocCheckBox mt-0" role="button" checked>
                                                        <label class="form-check-label ms-2" role="button" checked for="option1">
                                                            <img src="https://d2u56hfpsewfc3.cloudfront.net/images/pdf.gif" width="16" height="16" align="absmiddle" alt="pdf">&nbsp;&nbsp;${productCode} Datasheet</label>
                                                    </div>
                                                    <div class="form-check ms-4 d-flex align-items-center mb-3">
                                                        <input type="checkbox" name="interested" id="option2" value="${productCode}-GSM" class="form-check-input productDocCheckBox mt-0" role="button" checked>
                                                        <label class="form-check-label ms-2" role="button" checked for="option2">
                                                            <img src="https://d2u56hfpsewfc3.cloudfront.net/images/pdf.gif" width="16" height="16" align="absmiddle" alt="pdf">&nbsp;&nbsp;${productCode} - Getting Started Manual 
                                                        </label>
                                                    </div>
                                                    <h6>&nbsp;<img src="/images/list-icon.png" alt="Bullet Arrow">&nbsp;&nbsp;User Manual</h6>
                                                    <div class="form-check ms-4 d-flex align-items-center">
                                                        <input type="checkbox" name="interested" id="option3" value="${productCode}-LDS" class="form-check-input productDocCheckBox mt-0" role="button" checked>
                                                        <label class="form-check-label ms-2" role="button" checked for="option3">
                                                            <img src="https://d2u56hfpsewfc3.cloudfront.net/images/pdf.gif" width="16" height="16" align="absmiddle" alt="pdf">${productCode} Lens Datasheet</label>
                                                    </div>
                                                </div>
                                                <p style="margin-top: 15px;">
                                                    <img src="/images/download-btn.png" title="Download Camera Documents" id="Document-Download-bottom" alt="Download Camera Documents" border="0" class="product-page-doc" data-title="eCAM" data-productname="${productCode}" style="cursor: pointer">
                                                </p>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div id="customization" class="card tab-pane fade" role="tabpanel">
                                    <div class="card-header" role="tab">
                                        <h6 class="mb-0">
                                            <a class="accordion-button collapsed" data-bs-toggle="collapse" href="#collapse-customization">Kit Contents</a>
                                        </h6>
                                    </div>
                                    <div id="collapse-customization" class="collapse">
                                        <div class="card-body">
                                            <h6 class="nobullet">Kit Contents</h6>
                                            <ul class="bullet1 mediumSize">`;
  
  // Add kit contents
  productData.kitContents.forEach(item => {
    html += `<li>${escapeHtml(item)}</li>`;
  });
  
  html += `
                                                <li class="nobullet">Please contact <a href="mailto:camerasolutions@e-consystems.com" class="link">camerasolutions@e-consystems.com</a> for any customization or porting of camera driver to your requirements.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
  
  // Add sidebar if enabled
  if (config.includeSidebar && productData.applications && productData.applications.length > 0) {
    html += `
            <div class="col-xl-3">
                <div class="rightside-menu target-app">
                    <h3>Targeted Applications<div class="bottomLine"></div></h3>
                    <ul class="bullet1">`;
    
    productData.applications.forEach(app => {
      html += `
                        <li class="nolink">
                            <p class="mediumSize">${escapeHtml(app)}</p>
                        </li>`;
    });
    
    html += `
                    </ul>
                </div>
            </div>`;
  }
  
  html += `
        </div>
    </section>
    <section>
        <!-- #include virtual="footer-responsive-menu.html" -->
    </section>
    
    <script src="/js/product-price.js" type="text/javascript"></script>
    <script src="/js/main-scripts.js" type="text/javascript"></script>
    <script src="/js/common-scripts.js" type="text/javascript"></script>
    <script src="/js/bootstrap.bundle.min-v5.1.3.js" type="text/javascript"></script>
    <script src="/js/download-documents-common-file.js" type="text/javascript"></script>
    <script src="/js/product-page-js.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            //create the slider
            $('.pd-image-slider-wrapper').flexslider({
                selector: ".pd-image-slider > li",
                animation: "slide",
                controlNav: true,
                slideshow: true,
                animationLoop: true,
                directionNav: false,
                smoothHeight: true,
                start: function () {
                    jQuery('.pd-image-slider').children('li').css({
                        'opacity': 1,
                        'position': 'relative'
                    });
                }
            });
            
            // Improve mobile menu behavior
            if ($(window).width() <= 768) {
                $('.nav-tabs').addClass('flex-nowrap');
            }
            
            // Update carousel for mobile
            if ($(window).width() <= 576) {
                $('.carousel-inner img').css('max-width', '100%');
            }
        });
        
        // Handle window resize
        $(window).resize(function() {
            if ($(window).width() <= 768) {
                $('.nav-tabs').addClass('flex-nowrap');
            } else {
                $('.nav-tabs').removeClass('flex-nowrap');
            }
        });
    </script>
</body>
</html>`;
  
  return html;
};