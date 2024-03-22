class Player {
    constructor(id, name, jersey, team, position) {
      this.id = id;
      this.name = name;
      this.jersey = jersey;
      this.team = team;
      this.position = position;
      this.visible = true;
      this.matches = function (searchFor) {
        return (
          this.name.toLowerCase().includes(searchFor) ||
          this.position.toLowerCase().includes(searchFor) ||
          this.team.toLowerCase().includes(searchFor) ||
          this.jersey.includes(searchFor)
        );
      };
    }
  }