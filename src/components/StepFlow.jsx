import { Camera, ScanSearch, Hospital } from 'lucide-react';
const steps = [
  [Camera, '1. Foto', 'Envie uma foto da serpente.'],
  [ScanSearch, '2. Análise', 'O sistema avalia o risco da imagem.'],
  [Hospital, '3. Encaminhamento', 'Você recebe orientação e local de atendimento.'],
];
export default function StepFlow() {
  return (
    <section className="steps-section">
      <h2 className="section-title">Como funciona</h2>
      <div className="steps">
        {steps.map(([Icon,title,text]) => (
          <div className="step" key={title}>
            <div className="step-icon"><Icon size={25}/></div>
            <strong>{title}</strong><span>{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
