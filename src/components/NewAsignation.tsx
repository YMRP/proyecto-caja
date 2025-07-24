import HeaderPages from "./HeaderPages";
import Layout from "../pages/Layout";

function NewAsignation() {
  return (
    <Layout>
      <div className="flex flex-col  my-10 gap-6">
        <HeaderPages text="Nueva asignación" />
      </div>
    </Layout>
  );
}

export default NewAsignation;
