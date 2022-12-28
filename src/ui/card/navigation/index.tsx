import React from 'react';

export const Navigation: React.FC<{
  overBoardCharacters: string[];
  thirstyCharacters: string[];
  thirstyFight: boolean;
  thirstyOars: boolean;
  textOverBoard: string;
  textThirsty: string;
  srcBg: string;
  srcOars: string;
  srcFight: string;
}> = ({
  overBoardCharacters,
  thirstyCharacters,
  thirstyFight,
  thirstyOars,
  textOverBoard,
  textThirsty,
  srcBg,
  srcOars,
  srcFight,
}) => {
  return (
    <div>
      <h6>{textOverBoard}:</h6>
      <ul>
        {thirstyCharacters.map((e, idx) => {
          return <li key={idx}>{e}</li>;
        })}
      </ul>
      <img alt={'background'} src={srcBg} />
      {thirstyOars ? <img alt={'oars'} src={srcOars} /> : null}
      {thirstyFight ? <img alt={'fight'} src={srcFight} /> : null}
      <h6>{textThirsty}:</h6>
      <ul>
        {overBoardCharacters.map((e, idx) => {
          return <li key={idx}>{e}</li>;
        })}
      </ul>
    </div>
  );
};
