import React, { useState } from "react";
import { storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const TestFirebaseStorage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      // Create a reference to the file
      const fileRef = ref(storage, `test-uploads/${file.name}_${Date.now()}`);

      // Upload the file
      console.log("Uploading file to Firebase Storage...");
      const uploadResult = await uploadBytes(fileRef, file);
      console.log("Upload successful:", uploadResult);

      // Get the download URL
      console.log("Getting download URL...");
      const url = await getDownloadURL(uploadResult.ref);
      console.log("Download URL:", url);

      setDownloadURL(url);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        `Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">
        Test Firebase Storage
      </h2>

      <div className="space-y-4">
        <div>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="text-white"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
        >
          {uploading ? "Uploading..." : "Upload Test File"}
        </button>

        {error && (
          <div className="text-red-400 bg-red-900/20 p-3 rounded">
            Error: {error}
          </div>
        )}

        {downloadURL && (
          <div className="text-green-400 bg-green-900/20 p-3 rounded">
            <p>Success! Download URL:</p>
            <a
              href={downloadURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              {downloadURL}
            </a>
            {file && file.type.startsWith("image/") && (
              <div className="mt-2">
                <img
                  src={downloadURL}
                  alt="Uploaded"
                  className="max-w-xs rounded"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestFirebaseStorage;

