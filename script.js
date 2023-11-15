// Function to check if the order number requires palletizing
function checkPalletOrder(orderNumber) {
    const palletOrderNumbers = ["102", "106", "143", "163", "169"];
    return palletOrderNumbers.includes(orderNumber);
  }
  
  // Get a reference to the form
  const orderForm = document.getElementById("orderForm");
  
  // Get a reference to the productList element
  const productListElement = document.getElementById("productList");
  
  // Get a reference to the palletizing message element
  const palletizingMessage = document.getElementById("palletizingMessage");
  
  // Create a counter for the total stacks and cases
  let totalStacks = 0;
  let totalCases = 0;
  
  // Create an array to store grabbed stacks
  const grabbedStacks = [];
  
  // Add a submit event listener to the form
  orderForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting
  
    // Get the order number from the input field
    const orderNumberInput = document.getElementById("orderNumber");
    const orderNumber = orderNumberInput.value.trim();
  
    // Check if the order requires palletizing
    const requiresPalletizing = checkPalletOrder(orderNumber);
  
    // Display palletizing message
    palletizingMessage.textContent = requiresPalletizing
      ? "This order NEEDS palletizing."
      : "This order does NOT require palletizing.";
  
      // Add style
      palletizingMessage.style.color = requiresPalletizing ? "red" : "black";
  
    // Define an object to store product names and their quantities
    const productQuantities = {};
  
    // Loop through each input field in the form and store the quantity in the object
    const inputs = orderForm.querySelectorAll("input[type='number']");
    inputs.forEach((input) => {
      const productName = input.name;
      const quantity = parseInt(input.value, 10);
      if (!isNaN(quantity) && quantity > 0) {
        productQuantities[productName] = quantity;
      }
    });
  
    // Create an array to represent the current stack
    const currentStack = [];
    let totalCasesInStack = 0;
  
    // Create an array to store the planned stacks
    const plannedStacks = [];
  
    // Loop through the product quantities and plan the stacks
    for (const productName in productQuantities) {
      let quantity = productQuantities[productName];
  
      while (quantity > 0) {
        // Check if adding this product will exceed the maximum cases per stack
        if (totalCasesInStack + quantity <= 6) {
          currentStack.push({ product: productName, cases: quantity });
          totalCasesInStack += quantity;
          quantity = 0;
        } else {
          // If adding the product exceeds the maximum cases, start a new stack
          const casesToAdd = 6 - totalCasesInStack;
          currentStack.push({ product: productName, cases: casesToAdd });
          plannedStacks.push([...currentStack]);
          currentStack.length = 0;
          totalCasesInStack = 0;
          quantity -= casesToAdd;
        }
      }
    }
  
    // If there are any remaining products in the current stack, add it to planned stacks
    if (currentStack.length > 0) {
      plannedStacks.push([...currentStack]);
    }
  
   // Get a reference to the clear button
  const clearButton = document.getElementById("clearButton");
  
  // Add a click event listener to the clear button
  clearButton.addEventListener("click", function () {
    // Display a confirmation dialog
    const isConfirmed = confirm("Are you sure you want to clear the form and stacks?");
    
    // Check if the user confirmed
    if (isConfirmed) {
      clearFormAndStacks();
    }
  });
  
  // Get a reference to the clear stacks button
  const clearStacksButton = document.getElementById("clearStacksButton");
  
  // Add a click event listener to the clear stacks button
  clearStacksButton.addEventListener("click", function () {
    // Display a confirmation dialog
    const isConfirmed = confirm("Are you sure you want to clear the planned stacks?");
    
    // Check if the user confirmed
    if (isConfirmed) {
      // Clear the planned stacks
      plannedStacks.length = 0;
  
      // Clear the productList element
      productListElement.innerHTML = "";
  
      // Reset total stacks and total cases
      totalStacks = 0;
      totalCases = 0;
  
      // Update the display
      updateDisplay();
    }
  });
  
    plannedStacks.forEach((stack, index) => {
      // Create a list of products for each stack
      const productUl = document.createElement("ul");
      stack.forEach((item) => {
        const productLi = document.createElement("li");
        productLi.textContent = `${item.product}: ${item.cases} cases`;
        productUl.appendChild(productLi);
      });
  
      // Create a "Grab" button for each stack
      const grabButton = document.createElement("button");
      grabButton.textContent = "Grab";
  
      // Add a click event listener to the "Grab" button
      grabButton.addEventListener("click", () => {
        // Handle grabbing the stack here
        // For now, let's remove the stack from the UI
        productListElement.removeChild(stackLi);
        // Update the display of total cases and stacks
        totalCases -= stack.reduce((total, item) => total + item.cases, 0);
        totalStacks -= 1;
        updateDisplay();
      });
  
      const stackLi = document.createElement("li");
      stackLi.appendChild(productUl);
      stackLi.appendChild(grabButton);
  
      productListElement.appendChild(stackLi);
    });
  
    // Display the productList element when stacks are generated
    productListElement.style.display = "block";
  
    // Update the display of total cases and stacks
    totalStacks += plannedStacks.length;
    totalCases += plannedStacks.reduce((total, stack) =>
      total + stack.reduce((cases, item) => cases + item.cases, 0), 0);
    updateDisplay();
  });
  
  // Function to update the display of total cases and stacks
  function updateDisplay() {
    const totalStacksElement = document.getElementById("stacksLeft");
    totalStacksElement.textContent = totalStacks;
  
    const totalCasesElement = document.getElementById("totalCases");
    totalCasesElement.textContent = totalCases;
  }
  
  // Loop through the product quantities and plan the stacks
  for (const productName in productQuantities) {
    let quantity = productQuantities[productName];
  
    while (quantity > 0) {
      // Check if adding this product will exceed the maximum cases per stack
      if (totalCasesInStack + quantity <= 6) {
        // Check if the quantity is greater than 0 before adding to the stack
        if (quantity > 0) {
          currentStack.push({ product: productName, cases: quantity });
          totalCasesInStack += quantity;
          quantity = 0;
        }
      } else {
        // If adding the product exceeds the maximum cases, start a new stack
        const casesToAdd = 6 - totalCasesInStack;
        // Check if the cases to add is greater than 0 before adding to the stack
        if (casesToAdd > 0) {
          currentStack.push({ product: productName, cases: casesToAdd });
          plannedStacks.push([...currentStack]);
          currentStack.length = 0;
          totalCasesInStack = 0;
          quantity -= casesToAdd;
        }
      }
    }
  }
  // Function to update the display of total cases and stacks
  function updateDisplay() {
    const totalStacksElement = document.getElementById("stacksLeft");
    totalStacksElement.textContent = totalStacks;
  
    const totalCasesElement = document.getElementById("totalCases");
    totalCasesElement.textContent = totalCases;
  }
  
  // Function to clear the form and stacks
  function clearFormAndStacks() {
    // Reload the page to reset everything
    window.location.reload();
  }
  
  
  // Get a reference to the clear button
  const clearButton = document.getElementById("clearButton");
  
  // Add a click event listener to the clear button
  clearButton.addEventListener("click", function () {
    clearFormAndStacks();
  });
  
// Function to open the camera and capture an image for OCR
function openCameraForOCR() {
    const constraints = { video: true };
  
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        const video = document.createElement('video');
        video.srcObject = stream;
        document.body.appendChild(video);
  
        // Wait for the video to be loaded and playing
        video.onloadedmetadata = () => {
          video.play();
  
          // Capture an image after a delay (adjust the delay as needed)
          setTimeout(() => {
            captureImageForOCR(video);
          }, 1000);
        };
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  }
  
  // Function to capture an image from the video feed for OCR
  function captureImageForOCR(video) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    // Get the data URL of the captured image
    const dataUrl = canvas.toDataURL('image/png');
  
    // Perform OCR on the captured image
    performOCR(dataUrl);
  
    // Cleanup: stop the video stream and remove the video element
    video.srcObject.getTracks().forEach(track => track.stop());
    document.body.removeChild(video);
  }
  
  // Get a reference to the scan document button
  const scanDocumentButton = document.getElementById("scanDocumentButton");
  
  // Add a click event listener to the scan document button
  scanDocumentButton.addEventListener("click", openCameraForOCR);
  
  // Rest of your existing code...
  
  // Function to handle OCR using Tesseract.js
  async function performOCR(image) {
    const result = await Tesseract.recognize(
      image,
      'eng', // language code, you can change this if needed
      { logger: (info) => console.log(info) }
    );
  
    // Extract relevant information from the scanned text
    const scannedInfo = extractInfoFromOCR(result.data.text.trim());
  
    // Update the order form with the scanned information
    updateOrderForm(scannedInfo);
  
    // For demonstration purposes, display the scanned text
    alert(`Scanned Text: ${result.data.text.trim()}`);
  }
  
  // Function to extract relevant information from the scanned text
  function extractInfoFromOCR(scannedText) {
    // Modify this function based on the structure of your scanned text
    // Example: Extract product names and quantities from the scanned text
    const productRegex = /(\w+) \d+ cases/g;
    const matches = [...scannedText.matchAll(productRegex)];
  
    const scannedInfo = {};
  
    matches.forEach((match) => {
      const productName = match[1];
      const quantityRegex = new RegExp(`${productName} (\\d+) cases`);
      const quantityMatch = scannedText.match(quantityRegex);
      const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 0;
  
      // Add the product and quantity to the scannedInfo object
      scannedInfo[productName] = quantity;
    });
  
    return scannedInfo;
  }
  
  // Function to update the order form with the scanned information
  function updateOrderForm(scannedInfo) {
    // Loop through the scannedInfo object and update the corresponding input fields
    for (const productName in scannedInfo) {
      const quantity = scannedInfo[productName];
  
      // Example: Update the input field for the product
      const inputField = document.querySelector(`input[name="${productName}"]`);
      if (inputField) {
        inputField.value = quantity;
      }
    }
  }
  