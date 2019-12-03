import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import propTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  Info,
  OwnerAvatar,
  Author,
  Title,
  LoadStars,
} from './styles';

export default class User extends Component {
  state = {
    stars: [],
    loading: false,
    refreshing: false,
    page: 1,
  };

  static propTypes = {
    navigation: propTypes.shape({
      getParam: propTypes.func,
      navigate: propTypes.func,
    }).isRequired,
  };

  handleNavigation = repository => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  loadMore = () => {
    const { page } = this.state;

    const nextPage = page + 1;

    this.loadStars(nextPage);
  };

  loadStars = async (page = 1) => {
    const { navigation } = this.props;

    const { stars } = this.state;

    this.setState({ loading: true });

    const user = navigation.getParam('user');

    const { data } = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });

    this.setState({
      loading: false,
      page,
      refreshing: false,
      stars: page >= 2 ? [...stars, ...data] : data,
    });
  };

  refreshList = () => {
    this.setState({ refreshing: true, stars: [] });
    this.loadStars();
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  async componentDidMount() {
    this.loadStars();
  }

  render() {
    const { navigation } = this.props;
    const { loading, refreshing, stars } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <LoadStars loading={loading}>
          {loading ? (
            <ActivityIndicator color="#7159c1" />
          ) : (
            <Stars
              data={stars}
              keyExtractor={star => String(star.id)}
              onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
              refreshing={refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
              onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
              onEndReached={this.loadMore} // Função que carrega mais itens
              renderItem={({ item }) => (
                <Starred onPress={() => this.handleNavigation(item)}>
                  <OwnerAvatar
                    source={{ uri: item.owner && item.owner.avatar_url }}
                  />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner && item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
            />
          )}
        </LoadStars>
      </Container>
    );
  }
}
