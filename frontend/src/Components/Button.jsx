// components/ui/Button.js
export function Button({ children, className, ...props }) {
  return (
    <button className={`px-6 py-3 rounded-lg ${className}`} {...props}>
      {children}
    </button>
  );
}
