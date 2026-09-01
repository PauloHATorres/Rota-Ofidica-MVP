import { TriangleAlert } from 'lucide-react';
export default function WarningBanner({ children }) {
  return <div className="warning-banner"><TriangleAlert size={20}/><div>{children}</div></div>;
}
