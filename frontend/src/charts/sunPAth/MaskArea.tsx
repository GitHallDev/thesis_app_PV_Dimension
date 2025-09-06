// MaskArea.tsx
import React from 'react';
import { Area, Line } from 'recharts';
import type { MaskPoint } from './maskData';

interface MaskAreaProps{
    maskData:MaskPoint[]
}

export const MaskArea: React.FC<MaskAreaProps> = ({ maskData }) => {

    return<>
    <Area 
    data={maskData}
    dataKey={"elevation"}
    name='Masque'
    stroke='none'
    fill='#f0f0f0'  
    xAxisId={"az"}
    yAxisId={"el"}
    />
    <Line 
    
    data={maskData}
    dataKey={"elevation"}
    dot={false}
    stroke='#888'
    strokeWidth={2}
    xAxisId={"az"}
    yAxisId={"el"}
    />
    </>
}