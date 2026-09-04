import { MODEL_CONFIG } from './modelConfig';


// ============================================================
// CARREGAR IMAGEM
// ============================================================

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    let objectUrl = null;

    if (source instanceof Blob) {
      objectUrl = URL.createObjectURL(source);
      img.src = objectUrl;
    } else {
      img.src = source;
    }

    img.onload = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      resolve(img);
    };

    img.onerror = (error) => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      reject(
        new Error(`Não foi possível carregar a imagem: ${error}`)
      );
    };
  });
}


// ============================================================
// PYTHON ROUND
//
// O CenterCrop do torchvision usa round().
// Esta função aproxima o comportamento "round half to even"
// do Python para evitar diferença de 1 pixel.
// ============================================================

function pythonRound(value) {
  const floor = Math.floor(value);
  const decimal = value - floor;

  if (decimal < 0.5) {
    return floor;
  }

  if (decimal > 0.5) {
    return floor + 1;
  }

  return floor % 2 === 0
    ? floor
    : floor + 1;
}


// ============================================================
// CALCULAR RESIZE
//
// torchvision.transforms.Resize(256)
//
// Quando recebe um inteiro, o torchvision redimensiona
// o MENOR lado para 256 e mantém a proporção.
// ============================================================

function calculateResize(width, height, targetShortSide) {
  if (width <= 0 || height <= 0) {
    throw new Error('Dimensões inválidas da imagem.');
  }

  if (width < height) {
    return {
      width: targetShortSide,
      height: Math.floor(
        (height * targetShortSide) / width
      ),
    };
  }

  return {
    width: Math.floor(
      (width * targetShortSide) / height
    ),
    height: targetShortSide,
  };
}


// ============================================================
// PRÉ-PROCESSAMENTO
// ============================================================

export async function preprocessImage(source) {
  const {
    resize,
    crop,
    mean,
    std,
  } = MODEL_CONFIG.preprocessing;


  // ----------------------------------------------------------
  // 1. Carregar RGB
  // ----------------------------------------------------------

  const image = await loadImage(source);

  const originalWidth = image.naturalWidth;
  const originalHeight = image.naturalHeight;


  if (!originalWidth || !originalHeight) {
    throw new Error(
      'Não foi possível determinar as dimensões da imagem.'
    );
  }


  // ----------------------------------------------------------
  // 2. Resize mantendo proporção
  // ----------------------------------------------------------

  const resized = calculateResize(
    originalWidth,
    originalHeight,
    resize
  );


  const resizeCanvas = document.createElement('canvas');

  resizeCanvas.width = resized.width;
  resizeCanvas.height = resized.height;


  const resizeCtx = resizeCanvas.getContext(
    '2d',
    {
      willReadFrequently: true,
    }
  );


  if (!resizeCtx) {
    throw new Error(
      'Não foi possível criar contexto Canvas 2D.'
    );
  }


  resizeCtx.imageSmoothingEnabled = true;
  resizeCtx.imageSmoothingQuality = 'high';


  resizeCtx.drawImage(
    image,
    0,
    0,
    resized.width,
    resized.height
  );


  // ----------------------------------------------------------
  // 3. CenterCrop 224 × 224
  // ----------------------------------------------------------

  const cropX = pythonRound(
    (resized.width - crop) / 2
  );

  const cropY = pythonRound(
    (resized.height - crop) / 2
  );


  const cropCanvas = document.createElement('canvas');

  cropCanvas.width = crop;
  cropCanvas.height = crop;


  const cropCtx = cropCanvas.getContext(
    '2d',
    {
      willReadFrequently: true,
    }
  );


  if (!cropCtx) {
    throw new Error(
      'Não foi possível criar contexto Canvas 2D.'
    );
  }


  cropCtx.drawImage(
    resizeCanvas,

    cropX,
    cropY,
    crop,
    crop,

    0,
    0,
    crop,
    crop
  );


  // ----------------------------------------------------------
  // 4. Obter pixels RGBA
  // ----------------------------------------------------------

  const imageData = cropCtx.getImageData(
    0,
    0,
    crop,
    crop
  );


  const rgba = imageData.data;


  // ----------------------------------------------------------
  // 5. Converter para:
  //
  // [1, 3, 224, 224]
  //
  // O ONNX recebe CHW, e não HWC.
  // ----------------------------------------------------------

  const pixelsPerChannel = crop * crop;

  const tensorData = new Float32Array(
    3 * pixelsPerChannel
  );


  for (
    let i = 0, pixel = 0;
    i < rgba.length;
    i += 4, pixel += 1
  ) {

    // RGBA -> RGB
    //
    // 0...255 -> 0...1

    const r = rgba[i] / 255.0;
    const g = rgba[i + 1] / 255.0;
    const b = rgba[i + 2] / 255.0;


    // --------------------------------------------
    // ImageNet normalization
    //
    // channel = (channel - mean) / std
    // --------------------------------------------

    tensorData[
      pixel
    ] = (
      r - mean[0]
    ) / std[0];


    tensorData[
      pixelsPerChannel + pixel
    ] = (
      g - mean[1]
    ) / std[1];


    tensorData[
      2 * pixelsPerChannel + pixel
    ] = (
      b - mean[2]
    ) / std[2];
  }


  // ----------------------------------------------------------
  // Resultado
  // ----------------------------------------------------------

  return {
    data: tensorData,

    dims: [
      1,
      3,
      crop,
      crop,
    ],

    debug: {
      originalWidth,
      originalHeight,

      resizedWidth: resized.width,
      resizedHeight: resized.height,

      cropX,
      cropY,

      cropWidth: crop,
      cropHeight: crop,
    },
  };
}