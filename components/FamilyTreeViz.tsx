import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Person, User } from '../types';
import { fetchFamilyTree, addPersonToTree } from '../services/api';
import { X, Calendar, MapPin, Upload, UserPlus, Save } from 'lucide-react';

export const FamilyTreeViz: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [data, setData] = useState<Person[]>([]);
  const [isAddingSelf, setIsAddingSelf] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // To check if linked
  
  // Form State for adding self
  const [linkFormData, setLinkFormData] = useState({
    parentId: '',
    birthDate: '',
    location: '',
    bio: ''
  });

  const loadData = async () => {
    const treeData = await fetchFamilyTree();
    setData(treeData);
  };

  useEffect(() => {
    // Hack: Get user from a context or prop in real app. 
    // Here we'll just check if there is a 'current' user in api.ts implicit state, 
    // but better to pass it down. For now, let's assume we can interact.
    loadData();
  }, []);

  useEffect(() => {
    if (!data.length || !svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = Math.max(600, width * 0.6);

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    // 1. Stratify (Flat List -> Hierarchy)
    // Handle cases where parentId might not exist in current set (orphans) 
    // by filtering or defaulting to a root.
    const validIds = new Set(data.map(d => d.id));
    const cleanData = data.map(d => ({
      ...d,
      parentId: (d.parentId && validIds.has(d.parentId)) ? d.parentId : null
    }));

    // Find root (node with no parent)
    const rootData = cleanData.find(d => d.parentId === null);
    
    // If multiple roots exist, D3 stratify might fail. 
    // We filter for the main cluster connected to the first found root for this demo.
    // In a production app, handle multiple disconnected trees (forest).
    
    let root;
    try {
      const stratify = d3.stratify<Person>()
        .id(d => d.id)
        .parentId(d => d.parentId);
        
      root = stratify(cleanData);
    } catch (e) {
      console.warn("Tree structure incomplete or cyclic, falling back to safe render", e);
      return; 
    }

    // 2. Tree Layout
    const treeLayout = d3.tree<Person>()
        .size([height - 100, width - 200])
        .nodeSize([60, 180]); // Fixed node size for consistent spacing [height, width]

    const rootNode = treeLayout(root);

    // 3. Zoom Behavior
    const svg = d3.select(svgRef.current);
    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Center initially
    // We need to calculate bounds after render to center properly, but approximation works:
    svg.call(zoom.transform as any, d3.zoomIdentity.translate(100, height/2).scale(0.8));

    // 4. Links
    g.selectAll(".link")
      .data(rootNode.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal<any, any>()
        .x(d => d.y)
        .y(d => d.x)
      )
      .attr("fill", "none")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2);

    // 5. Nodes
    const node = g.selectAll(".node")
      .data(rootNode.descendants())
      .enter().append("g")
      .attr("class", "node cursor-pointer group")
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedPerson(d.data);
      });

    // Circle background
    node.append("circle")
      .attr("r", 28)
      .attr("fill", "#fff")
      .attr("stroke", "#0ea5e9")
      .attr("stroke-width", 3)
      .attr("class", "transition-all duration-300 group-hover:stroke-brand-700");

    // ClipPath for image
    node.append("clipPath")
      .attr("id", d => `clip-${d.data.id}`)
      .append("circle")
      .attr("r", 25);
    
    // Profile Image
    node.append("image")
      .attr("xlink:href", d => d.data.photoUrl)
      .attr("x", -25)
      .attr("y", -25)
      .attr("width", 50)
      .attr("height", 50)
      .attr("clip-path", d => `url(#clip-${d.data.id})`)
      .attr("preserveAspectRatio", "xMidYMid slice");

    // Labels
    node.append("text")
      .attr("dy", 45)
      .attr("x", 0)
      .style("text-anchor", "middle")
      .text(d => d.data.firstName)
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#334155")
      .style("pointer-events", "none") // Let clicks pass to group
      .clone(true).lower()
      .attr("stroke", "white")
      .attr("stroke-width", 3);

  }, [data]);

  const handleSelfAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkFormData.parentId) {
      alert("Please select a parent to link to.");
      return;
    }

    try {
      // In a real app, we'd get the current user ID from auth context
      // Here assuming a mock ID for 'me' or just passed
      const mockUserId = 'user_new'; // This would come from props.user.id
      
      await addPersonToTree(mockUserId, {
        firstName: 'Me', // Should pull from User profile
        lastName: 'User',
        parentId: linkFormData.parentId,
        birthDate: linkFormData.birthDate,
        location: linkFormData.location,
        bio: linkFormData.bio
      });
      
      setIsAddingSelf(false);
      loadData(); // Refresh tree
    } catch (err) {
      console.error(err);
      alert("Failed to add to tree");
    }
  };

  return (
    <div className="relative h-[calc(100vh-100px)] bg-gray-50 rounded-xl shadow-inner border border-gray-200 overflow-hidden" ref={containerRef}>
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" onClick={() => setSelectedPerson(null)} />
      
      {/* Floating Action Button for Self-Addition */}
      <div className="absolute top-4 left-4">
        <button 
          onClick={() => setIsAddingSelf(true)}
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md text-brand-600 font-medium hover:bg-brand-50 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Yourself to Tree</span>
        </button>
      </div>

      {/* Add Self Modal Overlay */}
      {isAddingSelf && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Link Profile to Family</h2>
              <button onClick={() => setIsAddingSelf(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSelfAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Your Parent</label>
                <select 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 p-2 border"
                  value={linkFormData.parentId}
                  onChange={e => setLinkFormData({...linkFormData, parentId: e.target.value})}
                  required
                >
                  <option value="">-- Choose a Parent Node --</option>
                  {data.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Select the person in the tree who is your direct parent.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                <input 
                  type="date" 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 p-2 border"
                  value={linkFormData.birthDate}
                  onChange={e => setLinkFormData({...linkFormData, birthDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                <input 
                  type="text" 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 p-2 border"
                  placeholder="City, Country"
                  value={linkFormData.location}
                  onChange={e => setLinkFormData({...linkFormData, location: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                <Save className="w-4 h-4 mr-2" />
                Save & Link Profile
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Detail Slide-over */}
      {selectedPerson && (
        <div className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur rounded-lg shadow-xl border border-gray-200 p-6 animate-in slide-in-from-right-10 fade-in duration-200 z-40">
          <button 
            onClick={() => setSelectedPerson(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img 
                src={selectedPerson.photoUrl} 
                alt={selectedPerson.firstName} 
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-3"
              />
              <div className="absolute bottom-3 right-0 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{selectedPerson.firstName} {selectedPerson.lastName}</h2>
            {selectedPerson.bio && (
              <p className="text-sm text-gray-500 text-center mt-1 px-2 italic">"{selectedPerson.bio}"</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-700 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Calendar className="w-4 h-4 mr-3 text-brand-500" />
              <div>
                <span className="block text-[10px] uppercase tracking-wide text-gray-400">Lifespan</span>
                {selectedPerson.birthDate || '?'} — {selectedPerson.deathDate || 'Present'}
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-700 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <MapPin className="w-4 h-4 mr-3 text-brand-500" />
              <div>
                <span className="block text-[10px] uppercase tracking-wide text-gray-400">Location</span>
                {selectedPerson.location || 'Unknown'}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo / Docs
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded text-xs text-gray-500 pointer-events-none select-none shadow-sm">
        Scroll to zoom • Drag to pan • Click nodes for details
      </div>
    </div>
  );
};