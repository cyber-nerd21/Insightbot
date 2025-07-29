// app/components/Header.tsx
'use client';
import { useRef } from 'react';

interface HeaderProps {
  uploadedFile: File | null;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ uploadedFile, handleFileUpload, setIsStarted }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null); // Typed ref for file input

  const handleReset = () => {
    setIsStarted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear file input
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">InsightBot</h1>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          ref={fileInputRef} // Attach the ref
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Upload PDF
        </label>
        {uploadedFile && (
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Reset
          </button>
        )}
      </div>
    </header>
  );
}