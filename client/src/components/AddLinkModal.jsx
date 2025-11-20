import { useState } from "react";
import { createLink } from "../api/linkService";
import { Modal, Button, Form } from "react-bootstrap";

export default function AddLinkModal({ show, onClose, onDone }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

const submit = async () => {
  setLoading(true);
  try {
    // Only send code if user entered something
    const payload = { url };
    if (code.trim() !== "") payload.code = code;

    await createLink(payload);
    onDone();
    onClose();
    setUrl("");
    setCode("");
  } catch (e) {
    alert(e.response?.data?.error || "Server error");
  }
  setLoading(false);
};

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Short Link</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>URL</Form.Label>
            <Form.Control
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Custom Code (optional)</Form.Label>
            <Form.Control
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={loading} onClick={submit}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
