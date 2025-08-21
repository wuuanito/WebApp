import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Activity, Factory, Pill } from 'lucide-react';
import Sala27 from './Sala27/Sala27';
import Softgel from './Softgel/Softgel';

const MonitorizacionSystem = () => {
  const [activeTab, setActiveTab] = useState('sala27');

  return (
    <div>
      

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'sala27' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('sala27')}
            className="flex items-center gap-2"
          >
            <Factory className="h-4 w-4" />
            Sala 27
          </Button>
          <Button
            variant={activeTab === 'softgel' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('softgel')}
            className="flex items-center gap-2"
          >
            <Pill className="h-4 w-4" />
            Softgel
          </Button>
        </div>
      </div>
      {/* Sala 27 Content */}
       {activeTab === 'sala27' && <Sala27 />}

      {/* Softgel Content */}
       {activeTab === 'softgel' && <Softgel />}
    </div>
  );
};

export default MonitorizacionSystem;