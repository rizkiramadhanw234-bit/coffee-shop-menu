export function toFormData(data: Record<string, unknown>) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (!value === undefined && !value === null) {
      formData.append(key, value as string | Blob);
    }
  });
  return formData;
}
