'use client';

import { PhotoIcon } from '@heroicons/react/24/solid';
import { ChangeEvent, useEffect, useState } from 'react';

interface Props {
  onUploaded: (url: string) => void;
  initialValue?: string;
  blockId: string;
}

export function FormFileUpload({ onUploaded, initialValue, blockId }: Props) {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialValue) {
      setUploadedFileUrl(initialValue);
    }
  }, [initialValue]);
  const handleUpload = async (ev: ChangeEvent<HTMLInputElement>) => {
    ev.preventDefault();

    const firstFile = ev.target?.files?.[0];

    if (!firstFile || !blockId) {
      return;
    }

    if (firstFile.size > 10 * 1024 * 1024) {
      alert('File too large. Please upload a file smaller than 10MB.');
      return;
    }

    if (!firstFile.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const body = new FormData();

    body.append('file', firstFile, firstFile.name);
    body.append('blockId', blockId);

    const response = await fetch('/api/page/blocks/upload-asset', {
      method: 'POST',
      body,
    });
    const responseData = await response.json();

    if (!response.ok) {
      alert(responseData.message);
      return;
    }

    onUploaded(responseData.url);
    setUploadedFileUrl(responseData.url);
  };

  return (
    <>
      <label
        htmlFor="cover-photo"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Asset
      </label>
      {uploadedFileUrl && (
        <img src={uploadedFileUrl} className="w-16 h-16 rounded-md" />
      )}

      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <PhotoIcon
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleUpload}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>
    </>
  );
}
