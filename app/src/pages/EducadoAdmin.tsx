import { useState } from "react";
import Layout from "../components/Layout";

import { InstitutionsTableAdmin } from "../components/Admin/InstitutionsTableAdmin";
import { UsersTableAdmin } from "../components/Admin/UsersTableAdmin";

const EducadoAdmin = () => {
  const [selectedTable, setSelectedTable] = useState<"users" | "institutions">(
    "users"
  );

  const activeTable =
    selectedTable === "users" ? (
      <UsersTableAdmin />
    ) : (
      <InstitutionsTableAdmin />
    );

  return (
    <Layout meta="Educado Admin">
      <div className="w-full flex flex-row space-x-2 px-12 py-10">
        <div className="inline-block min-w-full shadow overflow-hidden rounded-xl bg-white">
          <div className="flex flex-row no-wrap"></div>

          <div className="navbar justify-end md:w-full bg-none p-6 mt-4">
            <div className="flex-none flex w-full">
              <button
                className={`flex-shrink-0 w-1/2 px-12 py-3 text-base font-semibold border-b border-b-[#166276] font-['Montserrat'] ${
                  selectedTable === "users"
                    ? "bg-[#166276] text-white"
                    : "bg-white text-[#166276]"
                } font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-200 text-center`}
                onClick={() => setSelectedTable("users")}
              >
                <span>Users</span>
              </button>
              <button
                className={`flex-shrink-0 w-1/2 px-12 py-3 text-base font-semibold border-b border-b-[#166276] font-['Montserrat'] ${
                  selectedTable === "institutions"
                    ? "bg-[#166276] text-white"
                    : "bg-white text-[#166276]"
                } font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-200 text-center`}
                onClick={() => setSelectedTable("institutions")}
              >
                <span>Institutions</span>
              </button>
            </div>
          </div>

          {activeTable}
        </div>
      </div>
    </Layout>
  );
};

export default EducadoAdmin;
