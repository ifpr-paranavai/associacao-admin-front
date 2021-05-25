import React, { Component } from "react";
import { useStyles } from "./estilo.js";
import {
  Paper,
  Container,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  Button,
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from "@material-ui/core/styles";
import ServicoAssociado from "../../servicos/ServicoAssociado";

class Associados extends Component {
  constructor(props) {
    super(props);
    this.state = {
      associados: [],
      page: 0,
      rowsPerPage: 5,
      qtdeInicial: 0,
      qtdeFinal: 10,
    };
  }
  async paginacao() {
    let associados = await ServicoAssociado.obterAssociados({
      _start: this.state.qtdeInicial, _end: this.state.qtdeFinal
    });

    this.setState({ associados });
  }

  async componentDidMount() {
    await this.paginacao();
  }

  async onChangePage(event, nextPage) {
    event.preventDefault();
    this.setState({ page: nextPage });
  }

  async onChangeRowsPerPage(event) {
    event.preventDefault();
    this.setState({ rowsPerPage: event.target.value });
  }
  render() {
    const { classes } = this.props;
    const { associados, page, rowsPerPage } = this.state;

    return (
      <Container className={classes.root}>
        <div>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<AddIcon />}
          >
            Adicionar
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Sobrenome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Celular</TableCell>
                <TableCell>WhatsApp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {associados
                .map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.sobrenome}</TableCell>
                    <TableCell>{user.cpf}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.tel_celular.numero}</TableCell>
                    <TableCell>{user.tel_celular.whatsapp}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[3, 10, 15, 25, 50]}
            count={associados.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.onChangePage}
            onChangeRowsPerPage={this.onChangeRowsPerPage}
          />
        </TableContainer>
      </Container>
    );
  }
}

export default withStyles(useStyles)(Associados);
