import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Training - Summit Chronicles',
  description:
    'Monitor the physical preparation and metrics for the Everest 2027 expedition.',
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
