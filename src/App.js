import './App.css';
import React, { useState, useEffect } from 'react';
function App() {
  const [dataSet, setDataSet] = useState([])
  const log = [
    '14:02:03 ALICE99 Start',
    '14:02:05 CHARLIE End',
    '14:02:34 ALICE99 End',
    '14:02:58 ALICE99 Start',
    '14:03:02 CHARLIE Start',
    '14:03:33 ALICE99 Start',
    '14:03:35 ALICE99 End',
    '14:03:37 CHARLIE End',
    '14:04:05 ALICE99 End',
    '14:04:23 ALICE99 End',
    '14:04:41 CHARLIE Start'
  ]

  useEffect(() => {
    let allDataSet = []
    let finalArr = []
    log.forEach((item, key) => {
      let data = item.split(' ')
      allDataSet.push({ 'name': data[1], 'time': data[0], 'type': data[2], 'key': key })
    })

    const groupByName = allDataSet.reduce((group, allDataSets) => {
      const { name } = allDataSets;
      group[name] = group[name] ?? [];
      group[name].push(allDataSets);
      return group;
    }, {});

    for (let name in groupByName) {
      let res = computeSessionTime(groupByName[name], name);
      finalArr.push(res);

    }
    setDataSet(finalArr)
    function computeSessionTime(data, name) {
      let arr = [];
      let gap = []

      data.forEach((item, key) => {
        if (item.type === 'Start') {
          if (data[key + 1]?.type === 'End') {
            gap.push(timeGap(data[key]?.time, data[key + 1]?.time))
          } else {
            gap.push(timeGap(data[key]?.time, (data[key].key + 1 === allDataSet.length) ? data[key]?.time : allDataSet[data[key].key + 1]?.time))
          }
        } else if (item.type === 'End') {
          if (data[key - 1]?.type !== 'Start') {
            gap.push(timeGap(data[key]?.time, allDataSet[data[key].key - 1]?.time))
          }
        }
      })

      arr = { 'name': name, session: gap.length, time: sumTime(gap) }
      return arr;
    }
  }, [])

  function sumTime(array = []) {
    var times = [3600, 60, 1],
      sum = [...array]
        .map(s => s.split(':').reduce((s, v, i) => s + times[i] * v, 0))
        .reduce((a, b) => a + b, 0);

    return times
      .map(t => [Math.floor(sum / t), sum %= t][0])
      .map(v => v.toString().padStart(2, 0))
      .join(':');
  }

  // Function to find the time difference
  function getTimeInSeconds(str) {

    let curr_time = [];

    curr_time = str.split(':')
    for (let i = 0; i < curr_time.length; i++) {
      curr_time[i] = parseInt(curr_time[i]);
    }

    let t = curr_time[0] * 60 * 60
      + curr_time[1] * 60
      + curr_time[2];

    return t;
  }

  function convertSecToTime(t) {
    let hours = Math.floor(t / 3600);
    let hh = hours < 10 ? "0" + (hours).toString()
      : (hours).toString();
    let min = Math.floor((t % 3600) / 60);
    let mm = min < 10 ? "0" + (min).toString()
      : (min).toString();
    let sec = ((t % 3600) % 60);
    let ss = sec < 10 ? "0" + (sec).toString()
      : (sec).toString();
    let ans = hh + ":" + mm + ":" + ss;
    return ans;
  }

  // Function to find the time gap
  function timeGap(st, et) {

    let t1 = getTimeInSeconds(st);
    let t2 = getTimeInSeconds(et);

    let time_diff
      = (t1 - t2 < 0) ? t2 - t1 : t1 - t2;

    return convertSecToTime(time_diff);
  }
  return (
    <div className="App">
      <table border={2}>
        <tbody>
          <tr><td>Name</td><td>Session</td><td>Total time</td></tr>
          {dataSet.map((data) => <tr><td>{data.name}</td><td>{data.session}</td><td>{data.time}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

export default App;
