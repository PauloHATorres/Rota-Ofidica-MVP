export const MODEL_CONFIG = {
  model1: {
    url: `${import.meta.env.BASE_URL}models/modelo1_cobra.onnx`,

    inputName: 'input',
    outputName: 'logits',

    inputShape: [1, 3, 224, 224],

    classes: [
      'nao_cobra',
      'cobra',
    ],

    snakeClassIndex: 1,

    threshold: 0.23,
  },

  model2: {
    url: `${import.meta.env.BASE_URL}models/modelo2_ofidico.onnx`,

    inputName: 'input',
    outputName: 'logits',

    inputShape: [1, 3, 224, 224],

    classes: [
      'botropico',
      'crotalico',
      'elapico',
      'laquetico',
    ],

    operationalThreshold: 0.92,
  },

  preprocessing: {
    resize: 256,
    crop: 224,

    mean: [
      0.485,
      0.456,
      0.406,
    ],

    std: [
      0.229,
      0.224,
      0.225,
    ],
  },
};