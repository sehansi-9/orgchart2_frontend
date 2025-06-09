import React, { useState, useEffect } from 'react';
import { presidencies } from '../data/presidencies';
import './PresidentView.css';
import PresidencyDetails from './PresidencyDetails';

const PresidentView = () => {
  const [selectedPresidency, setSelectedPresidency] = useState(null); // main presidency
  const [comparisonTabs, setComparisonTabs] = useState([]); // comparison presidencies
  const [showSelection, setShowSelection] = useState(false); 
  const [clickedTabIndex, setClickedTabIndex] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const addComparisonTab = (presidency) => {
    if (comparisonTabs.length < 2) {
      setComparisonTabs([...comparisonTabs, presidency]); // add a comparison tab only if there are less than 2 comparison tabs
      setShowSelection(false);
    }
  };

  const removeComparisonTab = (index) => {
    setComparisonTabs(comparisonTabs.filter((_, i) => i !== index)); // remove by tab index
  };

  const canAddMoreComparisons = (selectedPresidency ? 1 : 0) + comparisonTabs.length < 3; // check if there are less than 3 overall tabs

  console.log('Presidencies data:', presidencies);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const radius = Math.min(dimensions.width, dimensions.height) * 0.25;
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height * 0.4;

  const nodes = presidencies.map((p, i) => {
    const angle = (2 * Math.PI * i) / presidencies.length;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { ...p, x, y };
  });


  console.log('Processed nodes:', nodes);

  const handleAddComparison = (presidency, index) => {
    if (canAddMoreComparisons) {
      setShowSelection(true);
      setActiveTabId(presidency.id);
      setClickedTabIndex(index);
    }
  };

  return (
    <div className="presidency-container">
      <div className={`svg-container ${selectedPresidency || comparisonTabs.length > 0 ? `shifted${comparisonTabs.length > 0 ? `-${comparisonTabs.length + 1}` : ''}` : ''}`}>
        <svg 
          width={dimensions.width} 
          height={dimensions.height} 
          className="svg-element"
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Layer 1: Background lines */}
          <g style={{ zIndex: 1 }}>
            {nodes.map(node => (
              <line 
                key={`line-${node.id}`}
                x1={centerX} 
                y1={centerY} 
                x2={node.x} 
                y2={node.y} 
                stroke="#aaa" 
                strokeWidth="2"
                style={{ transition: "all 0.3s ease" }}
              />
            ))}
          </g>

          {/* Layer 2: Presidency nodes */}
          <g style={{ zIndex: 2 }}>
            {nodes.map(node => {
              const isSelected = selectedPresidency?.id === node.id;
              return (
                <g
                  key={node.id}
                  style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
                  transform={`translate(${node.x}, ${node.y}) scale(${isSelected ? 1.3 : 1})`} // scale up when selected
                  onClick={() => {
                    if (!comparisonTabs.some(tab => tab.id === node.id)) {
                      setSelectedPresidency(node); // set the selected presidency or change the first opened 'main' tab
                    }
                  }}
                >
                  <circle 
                    cx={0} 
                    cy={0} 
                    r={50} 
                    fill={node.color}
                    stroke="#fff"
                    strokeWidth="2"
                    filter="url(#shadow)"
                
                  />
                  <text 
                    x={0} 
                    y={5} 
                    textAnchor="middle" 
                    fill="white" 
                    fontSize="14" 
                    fontWeight="bold"
                  >
                    {node.name}
                  </text>
                  <text 
                    x={0} 
                    y={25} 
                    textAnchor="middle" 
                    fill="white" 
                    fontSize="12"
                  >
                    {`${node.startYear} - ${node.endYear}`}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Layer 3: Center node */}
          <g style={{ zIndex: 3 }}>
            <circle 
              cx={centerX} 
              cy={centerY} 
              r={60} 
              fill="white"
              stroke="#fff"
              strokeWidth="2"
              filter="url(#shadow)"
              style={{ transition: "all 0.3s ease" }}
            />
            <text 
              x={centerX} 
              y={centerY + 5} 
              textAnchor="middle" 
              fill="black" 
              fontSize="16"
              fontWeight="bold"
            >
              Governments
            </text>
          </g>
        </svg>
      </div>

      {/* Main Presidency Info Box */}
      {selectedPresidency && (
        <div 
          className="presidency-info-box"
          style={{
            right: `${comparisonTabs.length * 32}%`,
          }}
        >
          <div className="tab-header">
            <h3 className="tab-title">{selectedPresidency.name}</h3>
               {comparisonTabs.length === 0 && ( // add button only if there are no comparison tabs
            <div className="add-comparison-container">
              <button 
                onClick={() => handleAddComparison(selectedPresidency, -1)}
                className="add-comparison-button"
              >
                Add Comparison
              </button>
            </div>
          )}
            <button 
              onClick={() => {
                if (comparisonTabs.length > 0) {
                  // If there are comparison tabs, move the first comparison tab to be the main tab
                  setSelectedPresidency(comparisonTabs[0]);
                  setComparisonTabs(comparisonTabs.slice(1));
                } else {
                  setSelectedPresidency(null);
                }
              }}
              className="close-button"
            >
              ×
            </button>
          </div>
          
          <div className="tab-content">
            <div>
            <PresidencyDetails presidency={selectedPresidency} />
            </div>
          </div>

       
        </div>
      )}

      {/* Comparison Tabs */}
      {comparisonTabs.map((presidency, index) => (
        <div 
          key={presidency.id}
          className="presidency-info-box"
          style={{
            right: `${(comparisonTabs.length - index - 1) * 32}%`,
            zIndex: 1000 - index,
          }}
        >
          <div className="tab-header">
            <h3 className="tab-title">{presidency.name}</h3>
              {canAddMoreComparisons && ( // add button only if there are less than 3 overall tabs
            <div className="add-comparison-container">
              <button 
                onClick={() => handleAddComparison(presidency, index)}
                className="add-comparison-button"
              >
                Add Comparison
              </button>
            </div>
          )}
            <button 
              onClick={() => removeComparisonTab(index)}
              className="close-button"
            >
              ×
            </button>
          </div>
          
          <div className="tab-content">
            <div>
            <PresidencyDetails presidency={presidency} />
            </div>
          </div>

        
        </div>
      ))}

      {/* Comparison Selection Dialog */}
      {showSelection && (
        <div 
          className="selection-dialog"
          style={{
            right: `${(comparisonTabs.length - clickedTabIndex) * 32}%`,
          }}
        >
          <div className="selection-dialog-header">
            <h3 className="tab-title">Select Presidency to Compare</h3>
            <button 
              onClick={() => {
                setShowSelection(false);
              }}
              className="close-button"
            >
              ×
            </button>
          </div>
          <div className="selection-list">
            {presidencies
              .filter(p => 
                p.id !== selectedPresidency?.id && 
                !comparisonTabs.some(tab => tab.id === p.id) 
              )
              .map(presidency => (
                <button
                  key={presidency.id}
                  onClick={() => addComparisonTab(presidency)}
                  className="presidency-option"
                >
                  {presidency.name} ({presidency.startYear}-{presidency.endYear})
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PresidentView;