import {useState, useRef} from "react";
import { gql, useLazyQuery } from "@apollo/client";

const GET_LAUNCHES = gql`
    query ($launchYear: String
          $rocketName: String
          $missionName: String) {
        launches(launchYear: $launchYear
                 rocketName: $rocketName
                 missionName: $missionName) {
        mission_name
        launch_date_utc
        launch_year
        rocket {
            rocket_name
        }
        links {
            video_link
        }
    }
    }`;

const IndexPage = () => {
    const [getLaunches, {loading, error, data}] = useLazyQuery(GET_LAUNCHES,{
      onError(error) {
        console.error(error);
        setInvalidate(error);
      }
     });
    const [launchYear, setLaunchYear] = useState('');
    const [rocketName, setRocketName] = useState('');
    const [missionName, setMissionName] = useState('');
    const invalidate = useRef();
    
    const clearFilters = () => {
        setMissionName('');
        setRocketName('');
        setLaunchYear('');
        setInvalidate('');
    }

    const setInvalidate = (value) => {
       invalidate.current.value = value;
    }
    const controlMissionName = (e) => {
        setMissionName(e.target.value);
    }
    const controlRocketName = (e) => {
        setRocketName(e.target.value);
    }

    const controlLaunchYear = (e) => {
      setInvalidate('');
      if(isNaN(e.target.value))
            setInvalidate("Invalid launch year (YYYY)");
      setLaunchYear(e.target.value);
            
    }
    const preFetch = () => {
        if ( (launchYear || rocketName || missionName) && invalidate.current.value.length === 0)  {
            setInvalidate('');  // reset validation error if all set to get launches
            getLaunches({ variables: { launchYear, rocketName, missionName} });
        }else if(invalidate.current.value.length === 0) {
            setInvalidate("Please narrow search by specifying one of the criteria.");
        }
    }
    
    if (loading === true) return (<div className="col-sm-6">Loading...</div>);

    if (error === true) return (<div className="col-sm-6">Error</div>);

    return (
        <>
        <div className="container">
        <header>
        <div className="inputContainer-large">
              
            <span className="text" >Mission Name: </span>
            <input className="Field" type="text" value={missionName} onChange={controlMissionName}></input>
        </div>
        <div className="inputContainer">
              
              <span className="text">Rocket Name: </span>
              <input className="Field" type="text" value={rocketName} onChange={controlRocketName}></input>
          </div> 

          <div className="inputContainer">
              
            <span className="text">Launch Yr. (YYYY): </span>
            <input className="field-small" type="text" value={launchYear} onChange={controlLaunchYear}></input>
        </div>
        </header>
        <button className="Button" onClick={preFetch}>Search</button>
        <button className="Button" onClick={clearFilters}>Clear Filter</button>
        <div>
        <input className="error" ref={invalidate} tabIndex="-1" readOnly={true}></input>
        <input className="results" value={data? `${data.launches.length} launch(es)` : ''}  tabIndex="-1" readOnly={true}></input>
        </div>
      </div>
      <div>
          
      </div>
        <div className="container show-thumb">
      <div className="row">
      <div className="mission-list">
          {data && data.launches.map(({ mission_name, rocket, launch_date_utc, links}) => {
            return (
              <div className="missionbox" key={mission_name}>
                <div className="mission-clm col-sm-7">
                  <h5>
                    <div>{mission_name}</div>
                    <div>{rocket.rocket_name}</div> 
                    </h5>
                    <div>{launch_date_utc.split('T')[0]}</div>
                </div>
                <div className="mission-clm col-sm-5">
                <a href={links.video_link}>{links.video_link? 'Launch Video' : 'No Video'}</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </>
    )
};

export default IndexPage;