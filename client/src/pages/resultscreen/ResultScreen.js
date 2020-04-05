import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ResultScreen.module.css';
import { useLocation, Link } from 'react-router-dom';
import { Button, Card, Elevation, Spinner } from '@blueprintjs/core';
import { Chart } from 'react-charts';

function ResultScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const data = useLocation();
  const protein = data.protein;
  const genome = data.genome;
  const dna = data.dna.text;
  const isValid = protein !== undefined && genome !== undefined;
  const chartData = [
    {
      label: 'Series 1',
      data: [
        [0, 1],
        [1, 2],
        [2, 4],
        [3, 2],
        [4, 7],
      ],
    },
    {
      label: 'Series 2',
      data: [
        [0, 3],
        [1, 1],
        [2, 5],
        [3, 6],
        [4, 4],
      ],
    },
  ];
  const axes = [
    { primary: true, type: 'linear', position: 'bottom' },
    { type: 'linear', position: 'left' },
  ];

  console.log('results is:', results);

  useEffect(() => {
    //  Fetch probabilties
    const resultsData = async () => {
      await axios
        .post(
          `http://localhost:8080/matrix/${protein.protein.matrix_id}/PPM/5`,
          {
            dna: dna,
          }
        )
        .then(function (response) {
          setResults(response.data);
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    };
    resultsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const homeButton = (
    <div className={styles.homeButton}>
      <Link
        to={{
          pathname: '/',
        }}>
        <Button intent='primary' icon='home' minimal='true' large='true'>
          Home
        </Button>
      </Link>
    </div>
  );

  return !isLoading ? (
    <div className={styles.result}>
      {homeButton}
      <h1>Result</h1>
      <p>
        {isValid &&
          'The result of ' +
            protein.protein.name +
            ' and genome ' +
            genome +
            ':'}
        {!isValid &&
          'Not valid, protein or genome is undefined. Start over by pressing the Home-button.'}
      </p>
      <Card className={styles.resultContainer} elevation={Elevation.THREE}>
        <div className={styles.topResults}>
          <h1>Most likely bindings</h1>
          {results.top_x.map((element) => (
            <div key={element.id} className={styles.element}>
              <h4>{element.name}</h4>
              <p>Position: {element.position}</p>
              <p>Probability: {element.value}</p>
            </div>
          ))}
        </div>
        <div className={styles.chart}>
          <h1>Probabilities</h1>
          <Chart data={chartData} axes={axes} />
        </div>
      </Card>
    </div>
  ) : (
    <div className={styles.spinner}>
      <Spinner size='70' intent='primary' />
    </div>
  );
}

export default ResultScreen;
