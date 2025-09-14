import React from 'react';
import { DefaultLayout } from '../../components/templates/DefaultLayout';
import { ContentEditor } from '../../components/organisms/ContentEditor';

export default function EditorPage() {
  return (
    <DefaultLayout>
      <div className="py-8">
        <ContentEditor />
      </div>
    </DefaultLayout>
  );
}