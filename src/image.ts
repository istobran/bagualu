/**
 * 执行图片加载
 * @param     url     图片地址
 * @return            图片加载的 promise
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const loadedFn = function () {
      this.width = img.naturalWidth;
      this.height = img.naturalHeight;
      this.loaded = true;
      img.removeEventListener('load', loadedFn);
      resolve(img);
    };
    const errorFn = err => {
      img.removeEventListener('error', errorFn);
      reject(err);
    };
    img.addEventListener('load', loadedFn);
    img.addEventListener('error', errorFn);
    img.src = url;
  });
}

export function readDataUrlFromBlob(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function loadUrlToFile(url: string): Promise<File> {
  // Fetch the resource from the URL
  const response = await fetch(url);
  // Check if the response was successful (status 200)
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  // Get the blob representation of the file
  const blob = await response.blob();
  const fileName = url.split('/').pop()!;
  // Create a File object from the blob (this is not strictly necessary,
  // as you could work with the blob directly, but if you need a File object...)
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now()
  });
}
