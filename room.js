function Room(name , id){
  this.name = name;
  this.id = id;
  this.people = [];
  this.available = true;
}
Room.prototype.addPerson = function(personID){
  if(this.available){
    this.person.push(personID);
  }
};
module.exports = Room;