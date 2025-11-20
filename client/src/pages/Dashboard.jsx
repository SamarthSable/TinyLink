import { useEffect, useState } from "react";
import { getLinks, deleteLink } from "../api/linkService";
import AddLinkModal from "../components/AddLinkModal";
import { Button, Table } from "react-bootstrap";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [show, setShow] = useState(false);

  const load = async () => {
    const res = await getLinks();
    setLinks(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mt-4">
      <h2>TinyLink Dashboard</h2>
      <Button className="my-3" onClick={() => setShow(true)}>
        + Create Link
      </Button>

      <AddLinkModal show={show} onClose={() => setShow(false)} onDone={load} />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Code</th>
            <th>URL</th>
            <th>Clicks</th>
            <th>Last Clicked</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {links.map((l) => (
            <tr key={l.code}>
              <td>{l.code}</td>
              <td>{l.targetUrl}</td>
              <td>{l.clicks}</td>
              <td>{l.lastClicked ? new Date(l.lastClicked).toLocaleString() : "Never"}</td>
              <td>
                <Button
                  size="sm"
                  variant="info"
                  href={`/code/${l.code}`}
                  className="me-2"
                >
                  Stats
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteLink(l.code).then(load)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
