// src/utils/templateParser.js - FIXED VERSION
export const parseContent = (content) => {
  console.log('=== ENHANCED PARSER STARTED ===');
  
  const productData = {
    name: '',
    title: '',
    description: '',
    highlights: [],
    overview: '',
    specifications: {},
    software: {},
    kitContents: [],
    optionalAccessories: [],
    warrantySupport: [],
    technicalDocumentation: [],
    applications: []
  };

  // Normalize line endings and split
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  console.log('Total lines after normalization:', lines.length);
  
  let currentSection = '';
  let currentSubSection = '';
  let inSoftwareSection = false;
  let inSpecificationsSection = false;
  let softwareContactLine = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    console.log(`Line ${i}: "${line}" | Section: "${currentSection}" | SubSection: "${currentSubSection}"`);
    
    // Detect product name and title (## format)
    if (line.startsWith('## ') && line.includes('--')) {
      const parts = line.split('--');
      productData.name = parts[0].replace('##', '').trim();
      productData.title = parts[1] ? parts[1].trim() : "";
      console.log(`Found product: ${productData.name} - ${productData.title}`);
      currentSection = 'product';
      continue;
    }
    
    // Detect main sections (# format)
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      const sectionName = line.replace('#', '').trim();
      const lowerSectionName = sectionName.toLowerCase();
      
      if (lowerSectionName.includes('highlights')) {
        currentSection = 'highlights';
        currentSubSection = '';
        inSpecificationsSection = false;
        inSoftwareSection = false;
        console.log('Entered Highlights section');
      } 
      else if (lowerSectionName.includes('overview')) {
        currentSection = 'overview';
        currentSubSection = '';
        inSpecificationsSection = false;
        inSoftwareSection = false;
        console.log('Entered Overview section');
      }
      else if (lowerSectionName.includes('specifications')) {
        currentSection = 'specifications';
        currentSubSection = '';
        inSpecificationsSection = true;
        inSoftwareSection = false;
        console.log('Entered Specifications section');
      }
      else if (lowerSectionName.includes('software')) {
        currentSection = 'software';
        currentSubSection = '';
        inSoftwareSection = true;
        inSpecificationsSection = false;
        // Initialize software object with description
        productData.software['Description'] = [];
        console.log('Entered Software section');
      }
      else if (lowerSectionName.includes('kit contents')) {
        currentSection = 'kit';
        currentSubSection = '';
        inSoftwareSection = false;
        inSpecificationsSection = false;
        console.log('Entered Kit Contents section');
      }
      else if (sectionName.includes('Targeted Applications') || sectionName.includes('applications')) {
        currentSection = 'applications';
        currentSubSection = '';
        inSoftwareSection = false;
        inSpecificationsSection = false;
        console.log('Entered Applications section');
      }
      else if (inSpecificationsSection) {
        // This is a specification sub-section
        currentSubSection = sectionName;
        console.log(`Specifications Subsection: ${currentSubSection}`);
        
        // Initialize this sub-section if it doesn't exist
        if (!productData.specifications[currentSubSection]) {
          productData.specifications[currentSubSection] = [];
        }
      }
      else if (inSoftwareSection) {
        // This is a software sub-section (like Supported Kernel Version, Linux camera driver)
        currentSubSection = sectionName;
        console.log(`Software Subsection: ${currentSubSection}`);
        
        // Initialize this sub-section if it doesn't exist
        if (!productData.software[currentSubSection]) {
          productData.software[currentSubSection] = [];
        }
      }
      continue;
    }
    
    // Process content based on current section
    switch (currentSection) {
      case 'highlights':
        if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
          const cleanLine = line.replace(/^[-•*]\s+/, '').trim();
          if (cleanLine) {
            productData.highlights.push(cleanLine);
            console.log(`Added highlight: ${cleanLine}`);
          }
        }
        break;
        
      case 'overview':
        if (line && !line.startsWith('#') && !line.startsWith('##')) {
          productData.overview += line + ' ';
        }
        break;
        
      case 'specifications':
        if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ') || line.startsWith('o ')) {
          const cleanLine = line.replace(/^[-•*o]\s+/, '').trim();
          if (cleanLine && currentSubSection) {
            // Add to current specification sub-section
            if (!productData.specifications[currentSubSection]) {
              productData.specifications[currentSubSection] = [];
            }
            productData.specifications[currentSubSection].push(cleanLine);
            console.log(`Added to ${currentSubSection}: ${cleanLine}`);
          }
        }
        break;
        
      case 'software':
        // For software section, handle all content
        if (line && !line.startsWith('#') && !line.startsWith('##')) {
          // Check for contact line - ONLY capture it in software section
          if ((line.includes('Please contact') || line.includes('camerasolutions@e-consystems.com')) && !softwareContactLine) {
            softwareContactLine = line;
            console.log(`Found software contact line: ${line}`);
          }
          // Handle bullet points
          else if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ') || line.startsWith('o ')) {
            const cleanLine = line.replace(/^[-•*o]\s+/, '').trim();
            if (cleanLine && currentSubSection) {
              // Add bullet point to current software sub-section
              if (!productData.software[currentSubSection]) {
                productData.software[currentSubSection] = [];
              }
              productData.software[currentSubSection].push(cleanLine);
              console.log(`Added to software.${currentSubSection}: ${cleanLine}`);
            }
          } else {
            // Handle description text
            if (currentSubSection === '') {
              // Add to Description section
              if (!productData.software['Description']) {
                productData.software['Description'] = [];
              }
              productData.software['Description'].push(line);
              console.log(`Added to software description: ${line}`);
            } else if (currentSubSection && productData.software[currentSubSection]) {
              // Add to current sub-section
              productData.software[currentSubSection].push(line);
              console.log(`Added text to software.${currentSubSection}: ${line}`);
            }
          }
        }
        break;
        
      case 'kit':
        // ONLY add bullet points to kit contents, ignore contact lines
        if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
          const cleanLine = line.replace(/^[-•*]\s+/, '').trim();
          if (cleanLine) {
            productData.kitContents.push(cleanLine);
            console.log(`Added kit item: ${cleanLine}`);
          }
        }
        // IGNORE contact lines in kit section - they should only be in software
        break;
        
      case 'applications':
        if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
          const cleanLine = line.replace(/^[-•*]\s+/, '').trim();
          if (cleanLine) {
            productData.applications.push(cleanLine);
            console.log(`Added application: ${cleanLine}`);
          }
        }
        break;
    }
  }

  // Store software contact line separately
  if (softwareContactLine) {
    productData.software['Contact'] = softwareContactLine;
  }
  
  // Clean up overview
  productData.overview = productData.overview.trim();
  
  // Create description from overview
  productData.description = productData.overview.substring(0, 150) + (productData.overview.length > 150 ? '...' : '');
  
  console.log('=== PARSING RESULTS ===');
  console.log('Product Name:', productData.name);
  console.log('Product Title:', productData.title);
  console.log('Highlights:', productData.highlights.length, 'items');
  console.log('Overview length:', productData.overview.length);
  console.log('Specifications:', Object.keys(productData.specifications).length, 'sections');
  Object.entries(productData.specifications).forEach(([key, value]) => {
    console.log(`  ${key}: ${value.length} items`);
  });
  console.log('Software:', productData.software);
  console.log('Kit Contents:', productData.kitContents);
  console.log('Applications:', productData.applications.length, 'items');
  
  return productData;
};