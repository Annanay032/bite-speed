export default function EditMessage({ textRef, nodeName, setNodeName }) {
  return (
    <div className="updatenode__controls">
      <div className="updatenode__header">Messages</div>
      <label>Text</label>
      <textarea
        ref={textRef}
        value={nodeName}
        className="node__text__Area"
        onChange={(evt) => setNodeName(evt.target.value)}
      />
    </div>
  );
}
