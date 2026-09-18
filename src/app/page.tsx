import { loadEthanDemo } from "../fixtures/ethan";
import { DemoApp } from "../ui/DemoApp";

export default function Page() {
  // Read actual fixture files on the server; only serializable fictional data crosses to the client.
  return <DemoApp data={loadEthanDemo()} />;
}
