// Stands in for every federated remote under test — the real ones only resolve
// through vite-plugin-federation, which the test config does not run.
export default function RemoteStub() {
  return <p>remote stub</p>
}
