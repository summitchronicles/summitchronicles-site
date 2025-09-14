import React from 'react';
import { DefaultLayout } from '../../components/templates/DefaultLayout';
import { ContentDashboard } from '../../components/organisms/ContentDashboard';

export default function ContentPage() {
  return (
    <DefaultLayout>
      <div className="py-8">
        <ContentDashboard />
      </div>
    </DefaultLayout>
  );
}