import React from 'react';
import propTypes from 'prop-types';
import { RepositoryView } from './styles';

// import { Container } from './styles';

export default function Repository({ navigation }) {
  const { html_url: uri } = navigation.getParam('repository');

  return <RepositoryView source={{ uri }} />;
}

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repository').name,
});

Repository.propTypes = {
  navigation: propTypes.shape({
    getParam: propTypes.func,
  }).isRequired,
};
