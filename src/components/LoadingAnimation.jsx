import lobbyLogo from "../lobbyLogo.png";

export default function LoadingAnimation({ addWhiteSpace = true }) {
  return (
    <div
      className={`container text-center ${addWhiteSpace ? "my-5 py-5" : ""}`}
    >
      <img
        src={lobbyLogo}
        alt="lobby logo"
        width={50}
        className="animatedLogo"
      />
    </div>
  );
}
