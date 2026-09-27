/**
 * Utility for downloading JSON data as a file on mobile and desktop browsers
 */
export function downloadJsonFile(jsonData: string, filename: string = 'gym-routine-backup.json') {
  try {
    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
    return true;
  } catch (err) {
    console.error('Failed to download file:', err);
    return false;
  }
}
