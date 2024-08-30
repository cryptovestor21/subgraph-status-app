import React, { useState, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import bannerImage from './ttb.png';

const SUBGRAPH_STATUS_QUERY = gql`
  query {
    indexingStatuses {
      subgraph
      synced
      health
      fatalError {
        message
      }
      chains {
        network
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
      entityCount
    }
  }
`;

const SubgraphStatus = () => {
  const { loading, error, data } = useQuery(SUBGRAPH_STATUS_QUERY);
  const [filter, setFilter] = useState('');

  const filteredData = useMemo(() => {
    if (!data?.indexingStatuses) return [];
    return data.indexingStatuses.filter(status =>
      Object.values(status).some(value => 
        String(value).toLowerCase().includes(filter.toLowerCase())
      ) ||
      status.chains.some(chain => 
        Object.values(chain).some(value => 
          String(value).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [data, filter]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full bg-transparent">
        <div className="max-w-6xl mx-auto">
<div className="h-[200px] relative overflow-hidden flex items-center justify-center">
  <img 
    src={bannerImage} 
    alt="The Gorphinator" 
    className="h-full object-contain" 
    style={{ backgroundColor: 'transparent' }} 
  />
</div>

          <div className="bg-white-800 py-4 px-4">
            <input
              type="text"
              placeholder="Filter subgraphs..."
              className="w-full px-3 py-2 placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subgraph</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Synced</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chain Head</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Processed</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity Count</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((status, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{status.subgraph}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.synced ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {status.synced ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.health === "healthy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {status.health}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{status.chains[0]?.network}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{status.chains[0]?.chainHeadBlock?.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{status.chains[0]?.latestBlock?.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{status.entityCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubgraphStatus;
