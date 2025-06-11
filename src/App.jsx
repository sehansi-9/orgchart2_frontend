import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TidyTree from "./components/TidyTree";
import PresidentView from "./components/PresidentView";
import DepartmentTimeline from "./components/DepartmentTimeline";

const App = () => {
  const [treeData, setTreeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tranform the json data compatible with tree structure
 const transformToTree = (ministries) => ({
  name: "Government",
  children: ministries.map((m) => ({
    name: m.name,
    children: (m.Departments || []).map((d) => ({
      name: d.name,
      google_map_script: d.google_map_script
    }))
  }))
});


  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const res = await fetch("http://localhost:8080/ministries"); 
        const rawData = await res.json();
        const tree = transformToTree(rawData);
        console.log("Tree data:", tree);
        setTreeData(tree);
      } catch (error) {
        console.error("Error loading tree data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreeData();
  }, []);

  return (
    <BrowserRouter>
        <Routes>
          <Route 
            path="/tree" 
            element={
              isLoading ? (
                <p style={{ color: "#fff" }}>Loading...</p>
              ) : (
                <TidyTree data={treeData} />
              )
            } 
          />
          <Route path="/" element={<PresidentView />} />
          <Route path="/timeline" element={<DepartmentTimeline />} />
         
        </Routes>
      
    </BrowserRouter>
  );
};

export default App;
