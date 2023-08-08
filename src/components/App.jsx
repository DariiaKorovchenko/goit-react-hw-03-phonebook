import React from 'react';
import { nanoid } from 'nanoid';
import { Form } from './Form/Form';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';

export class App extends React.Component {
  state = {
    contacts: [],
    filter: '',
  };

  getContactListData = data => {
    const currentContact = {
      name: data.name,
      number: data.number,
      id: nanoid(),
    };
    const including = this.state.contacts.some(contact =>
      contact.name.toLowerCase().includes(data.name.toLowerCase())
    );
    if (including) {
      alert(`${data.name} is already in contacts.`);
    } else {
      this.setState(prevState => {
        return {
          contacts: [...prevState.contacts, currentContact],
        };
      });
    }
  };

  changeFilter = event => {
    this.setState({ filter: event.currentTarget.value });
  };

  visibleContacts() {
    const visibleContacts = this.state.contacts.filter(contact => {
      return contact.name
        .toLowerCase()
        .includes(this.state.filter.toLowerCase());
    });
    return visibleContacts;
  }

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem('Contacts');
    const parsedContacts = JSON.parse(savedContacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('Contacts', JSON.stringify(this.state.contacts));
    }
  }

  render() {
    return (
      <div>
        <h1>Phonebook</h1>
        <Form onSubmit={this.getContactListData} />

        <h2>Contacts</h2>
        <Filter value={this.state.filter} filterData={this.changeFilter} />

        {this.state.filter === null ? (
          <ContactList
            contacts={this.state.contacts}
            deleteContact={this.deleteContact}
          />
        ) : (
          <ContactList
            contacts={this.visibleContacts()}
            deleteContact={this.deleteContact}
          />
        )}
      </div>
    );
  }
}
