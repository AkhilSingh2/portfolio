import type { Engineering } from "@/lib/engineering";

export function EngineeringBlock({ note }: { note: Engineering }) {
  return (
    <section className="engineering" aria-labelledby="engineering-title">
      <h2 id="engineering-title">{note.heading}</h2>
      <p>{note.summary}</p>
      {note.flow ? (
        <ol className="api-flow">
          {note.flow.map((step, index) => (
            <li key={step}>
              {index > 0 ? <span aria-hidden="true">→ </span> : null}
              {step}
            </li>
          ))}
        </ol>
      ) : null}
      {note.endpoints ? (
        <div className="api-table-wrap">
          <table className="api-table">
            <caption>Routes in the repository</caption>
            <thead>
              <tr>
                <th scope="col">Method</th>
                <th scope="col">Path</th>
                <th scope="col">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {note.endpoints.map((endpoint) => (
                <tr key={`${endpoint.method}-${endpoint.path}`}>
                  <td>{endpoint.method}</td>
                  <td>
                    <code>{endpoint.path}</code>
                  </td>
                  <td>{endpoint.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {note.examples?.map((example) => (
        <figure key={example.label} className="api-example">
          <figcaption>{example.label}</figcaption>
          <pre>
            <code>{example.code}</code>
          </pre>
        </figure>
      ))}
      <ul className="plain-list">
        {note.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
