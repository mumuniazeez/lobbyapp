export default function LoadingAnimation({addWhiteSpace = true}) {
  return (
    <div
      className={`container text-center ${addWhiteSpace ? "my-5 py-5" : ""}`}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
