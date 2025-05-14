import React, { useState, useEffect, useRef, useCallback } from 'react';
import CardLayout from '../../components/PageCard/PageCard'; // Assuming this path is correct
import './coi.css'; // Make sure this CSS file exists and is correct

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // ✅ Import auth

// --- Component ---
export default function Coi() {
  const totalCards = 1; // Assuming 7 steps total (Adjust if this component only handles 1)
  const [currentCard, setCurrentCard] = useState(1);
  const [currentFile, setCurrentFile] = useState(null); // State for the selected file object
  const [pdfDocState, setPdfDocState] = useState(null); // State for the pdfjs document object
  const [pdfTotalPages, setPdfTotalPages] = useState(0); // State for total pages
  const [isProcessing, setIsProcessing] = useState(false); // State for OCR simulation/processing overlay
  const [progressBarWidth, setProgressBarWidth] = useState('0%'); // State for progress bar width
  const navigate = useNavigate();

  const { token, orgId } = useAuth();

  // Refs for direct DOM interaction
  const fileInputRef = useRef(null);
  const fileNameDisplayRef = useRef(null);
  const pdfFileNamePreviewRef = useRef(null);
  const pdfPreviewContainerRef = useRef(null);
  const progressContainerRef = useRef(null);
  const ocrProcessingRef = useRef(null);
  const formContainerRef = useRef(null); // Ref for the main container to add 'uploaded' class
  const uploadStateRef = useRef(null); // Ref for the initial upload UI
  const formStateRef = useRef(null); // Ref for the form/preview UI
  const coiFormRef = useRef(null); // Ref for the <form> element

  // Refs for PDF rendering logic
  const pageNumRef = useRef(1); // Current page number being viewed/rendered

  // --- Helper Functions ---

  // Function to enable/disable the "Next" button
  const setNextButtonEnabled = useCallback((enabled) => {
    const btn = document.getElementById('nextBtn');
    if (!btn) {
      // console.warn("Could not find Next button (id='nextBtn') to enable/disable.");
      return;
    }
    if (enabled) {
      btn.classList.remove('disabled');
      btn.removeAttribute('aria-disabled');
    } else {
      btn.classList.add('disabled');
      btn.setAttribute('aria-disabled', 'true');
    }
  }, []);

  // Fill form fields using regex
  // Fill form fields using regex (depends on coiFormRef)
  const fillFormFields = useCallback((text) => {
    // Log the FULL text received
    console.log('--- fillFormFields: Received Text ---');
    console.log(text); // Log the entire text string
    console.log('--- fillFormFields: End Text ---');

    console.log('Attempting to fill form fields with extracted text...');
    let foundCount = 0;
    const form = coiFormRef.current;
    if (!form) {
        console.error("COI Form ref not found. Cannot fill fields.");
        return 0;
    }

    function setFieldValue(id, value) {
      const element = form.querySelector(`#${id}`);
      if (element && value) {
        // Clean up extra spaces and trim potential asterisks etc.
        const cleanedValue = value.trim().replace(/\s{2,}/g, ' ').replace(/[*]$/, '').trim();
        if (cleanedValue) {
            element.value = cleanedValue;
            console.log(`  ✓ fillFormFields: Set ${id} = "${cleanedValue.substring(0, 50)}${cleanedValue.length > 50 ? '...' : ''}"`);
            foundCount++;
             if (element.tagName === 'TEXTAREA' || element.type === 'text') {
                element.dispatchEvent(new Event('input', { bubbles: true }));
            }
            return true;
        }
      }
      return false;
    }

    let companyNameMatch; // Declare outside the try block to be accessible for address cleanup
        
    try {
      // Company Name
      console.log('fillFormFields: Matching Company Name...');
      const companyNameRegex = /certify\s+that\s+(.*?)\s+is\s+incorporated\s+on/i;
      companyNameMatch = text.match(companyNameRegex); // Assign to the outer variable
      console.log('fillFormFields: Company Name Match:', companyNameMatch);
      setFieldValue('companyName', companyNameMatch ? companyNameMatch[1] : null);

      // Date
      console.log('fillFormFields: Matching Date...');
      const dateRegex = /incorporated\s+on\s+this\s+([\w\s]+day\s+of\s+[\w\s]+\s+[\w\s]+)\s+under\s+the\s+Companies\s+Act/i;
      const dateMatch = text.match(dateRegex);
      console.log('fillFormFields: Date Match:', dateMatch);
      setFieldValue('incorporationDate', dateMatch ? dateMatch[1] : null);

      // CIN
      console.log('fillFormFields: Matching CIN...');
      const cinRegex = /(?:Corporate\s+Identity\s+Number.*?is)\s*([LU][\d]{5}[A-Z]{2}[\d]{4}[A-Z]{3}[\d]{6})/i;
      const cinMatch = text.match(cinRegex);
      console.log('fillFormFields: CIN Match:', cinMatch);
      setFieldValue('registrationNumber', cinMatch ? cinMatch[1] : null);

      // PAN
      console.log('fillFormFields: Matching PAN...');
      const panRegex = /(?:Permanent\s+Account\s+Number.*?is)\s*([A-Z]{5}[\d]{4}[A-Z]{1})\*?/i;
      const panMatch = text.match(panRegex);
      console.log('fillFormFields: PAN Match:', panMatch);
      setFieldValue('companyPan', panMatch ? panMatch[1] : null);

      // TAN
      console.log('fillFormFields: Matching TAN...');
      const tanRegex = /(?:Tax\s+Deduction.*?Account\s+Number.*?is)\s*([A-Z]{4}[\d]{5}[A-Z]{1})\*?/i;
      const tanMatch = text.match(tanRegex);
      console.log('fillFormFields: TAN Match:', tanMatch);
      setFieldValue('companyTan', tanMatch ? tanMatch[1] : null);

      // --- ADDRESS REGEX BLOCK with [\s\S]*? ---
      console.log('fillFormFields: Matching Address...');
      // Regex using [\s\S]*? to capture across newlines
      const addressRegex = /Mailing Address as per record available in Registrar of Companies office:\s*([\s\S]*?)(?:\*as|$)/i;
      const addressMatch = text.match(addressRegex);
      console.log('fillFormFields: Address Match:', addressMatch);
      let fullAddress = addressMatch ? addressMatch[1].trim().replace(/\s+/g, ' ') : null;

      // Further cleanup: remove the company name if it was captured at the start of the address
      // Check if companyNameMatch is valid and has a captured group before using it
      if (fullAddress && companyNameMatch && companyNameMatch[1]) {
          const companyNameFromMatch = companyNameMatch[1].trim();
          if (fullAddress.startsWith(companyNameFromMatch)) {
              console.log("fillFormFields: Removing duplicate company name from address start.");
              fullAddress = fullAddress.substring(companyNameFromMatch.length).trim();
          }
      }
      setFieldValue('address', fullAddress);
      // --- END OF ADDRESS BLOCK ---

    } catch (regexError) {
      console.error("Error during regex matching:", regexError);
      alert("An error occurred while trying to extract data with regex. Please check manually.");
    }

    console.log(`Extraction attempt complete. Found ${foundCount} fields.`);
    return foundCount;
  }, []); // Keep dependencies empty
  const applySampleData = useCallback(() => {
    console.warn("Applying sample data as fallback.");
    const form = coiFormRef.current;
    if (!form) return;

    // const sampleData = {
    //   companyName: 'Sample Tech Solutions Pvt. Ltd.',
    //   registrationNumber: 'U12345MH2023PTC123456',
    //   incorporationDate: '1st January 2023',
    //   companyPan: 'ABCDE1234F',
    //   companyTan: 'MUMX12345B',
    //   address: 'Unit 501, Sample Business Tower, Tech Park Road, Andheri East, Mumbai, Maharashtra 400093'
    // };

    // Update state with sample data
    // setFormData(sampleData);
    setNextButtonEnabled(true);
  }, [setNextButtonEnabled]);

  // Render a specific page of the PDF and attempt OCR
  const renderPage = useCallback(async (num) => {
    if (!pdfDocState || !pdfPreviewContainerRef.current) {
      console.error("renderPage: Missing pdfDocState or preview container ref.");
      setIsProcessing(false); // Ensure processing stops if refs are missing
      if (ocrProcessingRef.current) ocrProcessingRef.current.classList.remove('active');
      return;
    }
    console.log(`renderPage: Starting for page ${num}`);

    setIsProcessing(true);
    if (ocrProcessingRef.current) ocrProcessingRef.current.classList.add('active');

    let worker = null;

    try {
      console.log(`renderPage: Getting page ${num}...`);
      const page = await pdfDocState.getPage(num);
      console.log(`renderPage: Page ${num} obtained.`);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const scale = 2.0;
      const viewport = page.getViewport({ scale: scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = { canvasContext: ctx, viewport: viewport };

      console.log(`renderPage: Rendering page ${num} to canvas...`);
      await page.render(renderContext).promise;
      console.log(`renderPage: Page ${num} rendered to canvas.`);

      const container = pdfPreviewContainerRef.current;
      if (!container) {
        console.warn("renderPage: Preview container disappeared during render.");
        setIsProcessing(false);
        if (ocrProcessingRef.current) ocrProcessingRef.current.classList.remove('active');
        return;
      }
      container.innerHTML = '';
      container.appendChild(canvas);
      console.log(`renderPage: Canvas added to preview container.`);

      const imageData = canvas.toDataURL('image/png');
      console.log(`renderPage: Generated image data URL (length: ${imageData.length}).`);
      if (imageData.length < 100) {
          throw new Error("Generated image data seems empty or invalid.");
      }

      // console.log("renderPage: Initializing Tesseract worker...");
      // worker = await createWorker('eng', 1, {
      //    logger: m => console.log(`Tesseract: ${m.status}`, m.progress ? `(${Math.round(m.progress * 100)}%)` : '')
      // });
      console.log("renderPage: Tesseract worker initialized.");

      console.log("renderPage: Starting Tesseract recognize...");
      const { data: { text } } = await worker.recognize(imageData);
      console.log(`renderPage: Tesseract recognize finished. Text length: ${text?.length ?? 0}`);
      console.log("renderPage: Extracted text (first 300 chars):", text?.substring(0, 300));

      console.log("renderPage: Terminating Tesseract worker...");
      await worker.terminate();
      worker = null;
      console.log("renderPage: Tesseract worker terminated.");

      console.log("renderPage: Calling fillFormFields...");
      const fieldsFound = fillFormFields(text || "");
      console.log(`renderPage: fillFormFields returned: ${fieldsFound}`);

      if (fieldsFound === 0) {
        console.warn("renderPage: No fields found via OCR/Regex. Applying sample data.");
        alert("Could not automatically extract details. Please verify the information or fill manually. Applying sample data as a guide.");
        applySampleData();
      } else {
        console.log(`renderPage: ${fieldsFound} fields populated from OCR text.`);
        setNextButtonEnabled(true);
      }

    } catch (error) {
      console.error("renderPage: Error during OCR/Processing:", error);
      alert(`An error occurred during document processing: ${error.message || 'Unknown error'}. Applying sample data as fallback.`);
      applySampleData();

      if (worker) {
          try {
              console.log("renderPage: Terminating worker in error handler...");
              await worker.terminate();
              console.log("renderPage: Worker terminated in error handler.");
          } catch (termError) {
              console.error("renderPage: Error terminating worker during error handling:", termError);
          }
      }

    } finally {
      console.log("renderPage: Finally block executing.");
      setIsProcessing(false);
      if (ocrProcessingRef.current) ocrProcessingRef.current.classList.remove('active');
      // Button state is handled by applySampleData or successful extraction path now
      console.log("renderPage: Processing finished, overlay hidden.");
    }
  }, [pdfDocState, fillFormFields, applySampleData, setNextButtonEnabled]); // Correct dependencies

  // Reset UI to initial state
  const resetCOIState = useCallback(() => {
    console.log("Resetting COI State...");
    if (formContainerRef.current) formContainerRef.current.classList.remove('uploaded');
    if (uploadStateRef.current) uploadStateRef.current.style.display = 'flex';
    if (formStateRef.current) formStateRef.current.style.display = 'none';

    if (fileInputRef.current) fileInputRef.current.value = '';
    if (fileNameDisplayRef.current) {
      fileNameDisplayRef.current.textContent = 'No file selected';
      fileNameDisplayRef.current.style.display = 'none';
    }
    if (pdfFileNamePreviewRef.current) pdfFileNamePreviewRef.current.textContent = '';

    if (pdfPreviewContainerRef.current) {
      pdfPreviewContainerRef.current.innerHTML = `
         <div className="no-document-state">
             <i className="bi bi-file-earmark-x no-document-icon"></i>
             <p>Upload PDF to see preview</p>
         </div>`;
    }
    if (progressContainerRef.current) progressContainerRef.current.style.display = 'none';
    setProgressBarWidth('0%');

    if (ocrProcessingRef.current) ocrProcessingRef.current.classList.remove('active');
    setIsProcessing(false);

    setPdfDocState(null);
    setPdfTotalPages(0);
    setCurrentFile(null);

    pageNumRef.current = 1;

    if (coiFormRef.current) coiFormRef.current.reset();

    setTimeout(() => {
        coiFormRef.current?.querySelectorAll('textarea.form-control_coi').forEach(textarea => {
            textarea.style.height = 'auto';
            const computedStyle = window.getComputedStyle(textarea);
            const minHeight = parseInt(computedStyle.minHeight, 10) || 38;
            const paddingTop = parseInt(computedStyle.paddingTop, 10);
            const paddingBottom = parseInt(computedStyle.paddingBottom, 10);
            const borderTop = parseInt(computedStyle.borderTopWidth, 10);
            const borderBottom = parseInt(computedStyle.borderBottomWidth, 10);
            const disabledHeight = textarea.scrollHeight - paddingTop - paddingBottom;
            textarea.style.height = Math.max(minHeight, disabledHeight + paddingTop + paddingBottom + borderTop + borderBottom) + 'px';
        });
    }, 0);

    setNextButtonEnabled(false);
  }, [setNextButtonEnabled]);

  // Load PDF file - *** NO LONGER CALLS renderPage DIRECTLY ***
  const loadPDF = useCallback((file) => {
      console.log("loadPDF: Loading PDF:", file.name);

      if (!progressContainerRef.current || !pdfPreviewContainerRef.current) {
        console.error("loadPDF: disabled elements for loadPDF not found.");
        resetCOIState();
        return;
      }
      const progressContainer = progressContainerRef.current;
      const pdfPreviewContainer = pdfPreviewContainerRef.current;

      // Reset state but keep preview showing "loading"
      setPdfDocState(null);
      setPdfTotalPages(0);
      pageNumRef.current = 1;
      // Set initial loading state for preview
      pdfPreviewContainer.innerHTML = `<div className="no-document-state"><p>Loading preview...</p></div>`;

      progressContainer.style.display = 'block';
      setProgressBarWidth('0%');
      setNextButtonEnabled(false); // Disable nav while loading

      const fileURL = URL.createObjectURL(file);
      const loadingTask = window.pdfjsLib.getDocument(fileURL);

      loadingTask.onProgress = (progress) => {
        if (progress.total > 0) {
          const percent = Math.min(100, Math.round((progress.loaded / progress.total) * 100));
          setProgressBarWidth(percent + '%');
        }
      };

      loadingTask.promise.then(pdf => {
        console.log('loadPDF: PDF loaded successfully:', pdf.numPages, 'pages');
        setProgressBarWidth('100%');
        setTimeout(() => {
            if (progressContainerRef.current) progressContainerRef.current.style.display = 'none';
        }, 300);

        // --- ONLY SET STATE HERE ---
        setPdfDocState(pdf);
        setPdfTotalPages(pdf.numPages);
        // --- DO NOT CALL renderPage(1) here ---

      }).catch(error => {
        console.error('loadPDF: Error loading PDF:', error);
        if (progressContainerRef.current) progressContainerRef.current.style.display = 'none';
        if (pdfPreviewContainerRef.current) {
            pdfPreviewContainerRef.current.innerHTML = `
             <div className="no-document-state">
                 <i className="bi bi-exclamation-triangle no-document-icon text-danger"></i>
                 <p className="text-danger">Error loading PDF. ${error.message || 'Please check the file or try again.'}</p>
             </div>
           `;
        }
        alert(`Error loading PDF: ${error.message || 'The file might be corrupted or incompatible.'}`);
        resetCOIState();
      }).finally(() => {
        URL.revokeObjectURL(fileURL);
        console.log("loadPDF: Object URL revoked.");
      });
    // *** REMOVED renderPage from dependencies ***
  }, [resetCOIState, setNextButtonEnabled]);


  // --- Effects ---

  // Effect 1: Run initial reset on mount
  // useEffect(() => {
  //   resetCOIState();
  //    if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
  //      window.pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${window.pdfjsLib.version}/pdf.worker.js`;
  //      console.log("PDF.js worker source set.");
  //    } else if (!window.pdfjsLib) {
  //        console.error("pdfjsLib is not loaded.");
  //    }
  // }, [resetCOIState]);

  // Effect 2: Trigger loadPDF when currentFile changes
  useEffect(() => {
    if (currentFile) {
        console.log("Effect[currentFile]: File changed, calling loadPDF.");
        if (uploadStateRef.current) uploadStateRef.current.style.display = 'none';
        if (formStateRef.current) formStateRef.current.style.display = 'flex';
        if (formContainerRef.current) formContainerRef.current.classList.add('uploaded');

        if (fileNameDisplayRef.current) {
            fileNameDisplayRef.current.style.display = 'inline-block';
            fileNameDisplayRef.current.textContent = currentFile.name;
        }
        if (pdfFileNamePreviewRef.current) {
            pdfFileNamePreviewRef.current.textContent = currentFile.name;
        }
        if (pdfPreviewContainerRef.current) {
            pdfPreviewContainerRef.current.innerHTML = `<div className="no-document-state"><p>Loading preview...</p></div>`;
        }

        loadPDF(currentFile);
    }
  }, [currentFile, loadPDF]); // loadPDF dependency is needed here

  // *** NEW *** Effect 3: Trigger rendering AFTER pdfDocState is set
  useEffect(() => {
    if (pdfDocState && pdfTotalPages > 0) {
         console.log("Effect[pdfDocState]: pdfDocState is ready, calling renderPage(1).");
         if (!pdfPreviewContainerRef.current) {
             console.error("Effect[pdfDocState]: Preview container ref not found when trying to render!");
             return;
         }
         renderPage(1); // Call renderPage here
    } else {
        // This condition might be met initially or after reset
        console.log("Effect[pdfDocState]: pdfDocState not ready for rendering.");
    }
  }, [pdfDocState, pdfTotalPages, renderPage]); // Dependencies trigger this effect when state is ready


  // Effect 4: Setup textarea auto-resize listeners
  useEffect(() => {
    const textareas = coiFormRef.current?.querySelectorAll('textarea.form-control_coi');
    if (!textareas) return;

    const handleTextareaInput = function() {
       this.style.height = 'auto';
       const computedStyle = window.getComputedStyle(this);
       const minHeight = parseInt(computedStyle.minHeight, 10) || 38;
      //  const vPadding = parseInt(computedStyle.paddingTop, 10) + parseInt(computedStyle.paddingBottom, 10);
       const vBorder = parseInt(computedStyle.borderTopWidth, 10) + parseInt(computedStyle.borderBottomWidth, 10);
       this.style.height = `${Math.max(minHeight, this.scrollHeight + vBorder)}px`;
    };

    textareas.forEach(textarea => {
      textarea.addEventListener('input', handleTextareaInput);
      setTimeout(() => {
        // Ensure textarea exists before calling function on it
        if (textarea) {
            handleTextareaInput.call(textarea)
        }
      }, 0);
    });

    return () => {
      textareas.forEach(textarea => {
        textarea.removeEventListener('input', handleTextareaInput);
      });
    };
  }, [isProcessing]); // isProcessing is a reasonable trigger here


  useEffect(() => {
    if (!token || !orgId) return;
  
    const fetchCoiData = async () => {
      try {
        const response = await fetch('http://3.111.226.182/factops/coform/getCOI', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ org_id: orgId }),
        });
  
        const result = await response.json();
        if (result.status === 'success' && result.data) {
          // populate form
          const form = coiFormRef.current;
          if (!form) return;
  
          form.querySelector('#companyName').value = result.data.compay_name || '';
          form.querySelector('#incorporationDate').value = result.data.icorporation_date || '';
          form.querySelector('#registrationNumber').value = result.data.cin || '';
          form.querySelector('#companyPan').value = result.data.pan || '';
          form.querySelector('#companyTan').value = result.data.tan || '';
          form.querySelector('#address').value = result.data.address || '';
  
          if (uploadStateRef.current) uploadStateRef.current.style.display = 'none';
          if (formStateRef.current) formStateRef.current.style.display = 'flex';
          if (formContainerRef.current) formContainerRef.current.classList.add('uploaded');
  
          setNextButtonEnabled(true);
        }
      } catch (err) {
        console.error('Failed to fetch COI data:', err);
      }
    };
  
    fetchCoiData();
  }, [token, orgId, setNextButtonEnabled]);
  
  const handleSubmit = async (e) => {
    e?.preventDefault();
  
    if (!token || !orgId) {
      alert('Missing authentication. Cannot submit.');
      return;
    }
  
    if (!coiFormRef.current) return;
    const formData = new FormData(coiFormRef.current);
    const data = Object.fromEntries(formData.entries());
  
    const payload = {
      org_id: orgId,
      company_name: data.companyName,
      Incorporation_date: data.incorporationDate,
      CIN: data.registrationNumber,
      PAN: data.companyPan,
      TAN: data.companyTan,
      address: data.address
    };
  
    try {
      const response = await fetch('http://3.111.226.182/factops/coform/COI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit COI data');
      }
  
      const result = await response.json();
      console.log('Submission success:', result);
      navigate('/fact.inc/digital-creds'); // ✅ Move to next page
  
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to save data. Please try again.');
    }
  };
  
  
  


  // --- React Event Handlers ---

  const handleNext = () => {
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn && nextBtn.classList.contains('disabled')) {
      console.log("Next button clicked but is disabled.");
      return;
    }
  
    if (currentCard < totalCards) {
      setCurrentCard(prev => prev + 1);
    } else {
      console.log('Submit action triggered (Last Step)');
      handleSubmit(); // ✅ this calls the API
    }
  };
  
  const handlePrev = () => {
    if (currentCard > 1) {
      setCurrentCard(prev => prev - 1);
    }
  };

  // const handleSubmit = (e) => {
  //   e?.preventDefault();
  //   console.log('Form Submit / Final Step Action');
  //   if (coiFormRef.current) {
  //       const formData = new FormData(coiFormRef.current);
  //       const data = Object.fromEntries(formData.entries());
  //       console.log("Form Data:", data);
  //       // TODO: Add API call or further logic here
  //       alert("Data submitted (logged to console).");
  //   } else {
  //       console.error("Form ref not available for submission.");
  //   }
  // };

  const handleFileInputChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file only.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        console.log("File selected via input:", file.name);
        setCurrentFile(file); // This state change will trigger Effect 2
    }
  };

  const handleDragOver = (e) => {
       e.preventDefault();
       e.stopPropagation();
       e.currentTarget.classList.add('dragover');
   };

   const handleDragLeave = (e) => {
       e.preventDefault();
       e.stopPropagation();
       e.currentTarget.classList.remove('dragover');
   };

   const handleDrop = (e) => {
       e.preventDefault();
       e.stopPropagation();
       e.currentTarget.classList.remove('dragover');

       const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;

       if (file) {
           if (file.type !== 'application/pdf') {
               alert('Please upload a PDF file only.');
               return;
           }
           console.log("File dropped:", file.name);
           if (fileInputRef.current) {
                try {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInputRef.current.files = dataTransfer.files;
                } catch (error) {
                    console.warn("Could not set dropped file to input element:", error);
                }
           }
           setCurrentFile(file); // This state change will trigger Effect 2
       }
   };


  // --- Render Logic ---
  const renderCardContent = () => {
    // Only render Card 1 content for this specific component
    if (currentCard !== 1) {
        return <div>Step {currentCard} Content Placeholder</div>; // Placeholder for other steps
    }

    // Card 1 Content: COI Upload and Verification
    return (
        <div className="form-container_coi" id="formContainer" ref={formContainerRef}>
          <div className="content-container_coi" id="contentContainer">

            {/* ----- Upload State ----- */}
            <div className="upload-state_coi" id="uploadState" ref={uploadStateRef} style={{ display: 'flex' }}>
              <div className="page-header_coi">
                <h4>COI Details</h4>
                <p className="page-subtitle_coi">Upload your Certificate of Incorporation to auto-fill information.</p>
              </div>
              <div
                className="upload-container_coi"
                id="uploadContainer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
              >
                <i className="bi bi-file-earmark-arrow-up upload-icon_coi"></i>
                <h3 className="upload-title_coi">Upload Certificate PDF</h3>
                <p className="upload-subtitle_coi">Drag & drop file here or click</p>
                <button type="button" className="browse-btn_coi" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                    <i className="bi bi-folder2-open me-2"></i>Browse Files
                </button>
                <input
                    type="file"
                    id="fileInput"
                    ref={fileInputRef}
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                />
                <div className="file-name-display_coi" id="fileName" ref={fileNameDisplayRef} style={{ display: 'none', marginTop: '10px' }}>
                  {/* File name appears here */}
                </div>
              </div>
            </div>

            {/* ----- Form State (Preview & Fields) ----- */}
            <div className="form-state_coi" id="formState" ref={formStateRef} style={{ display: 'none' }}>
              {/* Form Side (Left) */}
              <div className="form-side_coi">
                <div className="form-content_coi">
                  <div className="page-header_coi">
                    <h4>Verify Information</h4>
                    <p className="page-subtitle_coi">Check extracted details or fill manually. <button type="button" className="btn btn-sm btn-outline-secondary ms-2" onClick={resetCOIState}><i className="bi bi-arrow-counterclockwise"></i> Upload New</button></p>

                  </div>
                  <form id="coiForm" ref={coiFormRef} onSubmit={handleSubmit}>
                    {/* Company Info Section */}
                    <div className="form-section_coi">
                      <h3 className="form-section_coi-title"><i className="bi bi-building"></i>Company Information</h3>
                      <div className="row gx-3 gy-3">
                        <div className="col-md-6">
                          <div className="form-group_coi">
                            <label htmlFor="companyName">Company Name</label>
                            <div className="input-group">
                              <input type="text" className="form-control_coi" id="companyName" name="companyName" placeholder="Auto-filled name" required />
                              <div className="form-control_coi-icon"><i className="bi bi-buildings"></i></div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group_coi">
                                <label htmlFor="incorporationDate">Date of Incorporation</label>
                                <div className="input-group">
                                <input type="text" className="form-control_coi" id="incorporationDate" name="incorporationDate" placeholder="DD MMMM YYYY" required/>
                                <div className="form-control_coi-icon"><i className="bi bi-calendar-event"></i></div>
                                </div>
                            </div>
                        </div>
                         <div className="col-md-12">
                          <div className="form-group_coi">
                            <label htmlFor="registrationNumber">Corporate Identification Number (CIN)</label>
                            <div className="input-group">
                              <input type="text" className="form-control_coi" id="registrationNumber" name="registrationNumber" placeholder="L/U#####XX####XXX######" required minLength="21" maxLength="21" />
                              <div className="form-control_coi-icon"><i className="bi bi-hash"></i></div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group_coi">
                            <label htmlFor="companyPan">Company PAN</label>
                            <div className="input-group">
                              <input type="text" className="form-control_coi text-uppercase" id="companyPan" name="companyPan" placeholder="ABCDE1234F" required pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" maxLength="10"/>
                              <div className="form-control_coi-icon"><i className="bi bi-card-heading"></i></div>
                            </div>
                          </div>
                        </div>
                         <div className="col-md-6">
                          <div className="form-group_coi">
                            <label htmlFor="companyTan">Company TAN</label>
                            <div className="input-group">
                              <input type="text" className="form-control_coi text-uppercase" id="companyTan" name="companyTan" placeholder="ABCD12345E" required pattern="[A-Z]{4}[0-9]{5}[A-Z]{1}" maxLength="10"/>
                              <div className="form-control_coi-icon"><i className="bi bi-input-cursor-text"></i></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="form-section_coi">
                      <h3 className="form-section_coi-title"><i className="bi bi-geo-alt-fill"></i>Registered Address</h3>
                      <div className="row gx-2">
                        <div className="col-md-12">
                          <div className="form-group_coi">
                            <label htmlFor="address">Full Registered Address (as per COI)</label>
                            <div className="input-group">
                              <textarea
                                className="form-control_coi"
                                id="address"
                                name="address"
                                placeholder="Auto-filled address"
                                style={{ minHeight: '40px' }}
                                rows="2"
                                disabled
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Preview Side (Right) */}
              <div className="pdf-side_coi">
                <div className="document-preview_coi-wrapper">
                   <div className="preview-header">
                       <h4 className="form-section_coi-title mb-0"><i className="bi bi-eye"></i>Document Preview</h4>
                   </div>
                   {/* Progress Bar */}
                   <div className="progress-container_coi" id="progressContainer" ref={progressContainerRef} style={{ display: 'none' }}>
                        <div className="progress" style={{ height: '8px' }}>
                            <div
                                className="progress-bar progress-bar-striped progress-bar-animated"
                                id="progressBar"
                                role="progressbar"
                                style={{ width: progressBarWidth }}
                                aria-valuenow={parseInt(progressBarWidth, 10)}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                  {/* PDF Canvas Area */}
                  <div className="document-preview_coi" id="documentPreview">
                    <div className="pdf-preview-container_coi" id="pdfPreviewContainer" ref={pdfPreviewContainerRef}>
                       <div className="no-document-state">
                          <i className="bi bi-file-earmark-x no-document-icon"></i>
                          <p>Upload PDF to see preview</p>
                       </div>
                    </div>
                                 {/* OCR Processing Overlay */}
                                 <div className={`ocr-processing ${isProcessing ? 'active' : ''}`} id="ocrProcessing" ref={ocrProcessingRef}>
                                <div className="ocr-content">
                                  <i className="bi bi-cpu ocr-icon"></i>
                                  <div className="ocr-text">Processing Document</div>
                                  <div className="ocr-subtext">Analyzing and extracting information...</div>

                                  <div id="extractionStatus" className="extraction-status" style={{ marginTop: '12px' }}>
                                    {[
                                      { icon: 'bi-building', text: 'Identifying company details...' },
                                      { icon: 'bi-geo-alt', text: 'Finding registered address...' },
                                      { icon: 'bi-card-heading', text: 'Extracting tax information (PAN/TAN)...' },
                                      { icon: 'bi-hash', text: 'Extracting CIN...' },
                                    ].map((item, index) => (
                                      <div
                                        key={index}
                                        className={`extraction-item ${isProcessing ? 'active' : ''}`}
                                        style={{ animationDelay: `${index * 0.4}s` }}
                                      >
                                        <div className="extraction-icon"><i className={`bi ${item.icon}`}></i></div>
                                        <div className="extraction-text">{item.text}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                </div>

                  </div>
                  {/* File Info Footer */}
                  <div className="preview-toolbar">
                    <div className="preview-info text-muted small">
                      File: <span id="pdfFileNamePreview" ref={pdfFileNamePreviewRef}></span>
                       {/* Optional Page Navigation */}
                       {/* ... */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  };

  // --- Final Render ---
  return (
    <CardLayout
    title="Certificate of Incorporation"
    currentCard={currentCard}
    totalCards={totalCards}
    onNext={handleNext} // ✅ this will call handleSubmit on final card
    onPrev={handlePrev}
    isFinalStep={currentCard === totalCards}
    onSubmit={handleSubmit}
    onFinalSubmit={() => navigate('/fact.inc/digital-creds')}
  >
    {renderCardContent()}
  </CardLayout>
  
  );
}