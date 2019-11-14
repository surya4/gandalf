CREATE DATABASE IF NOT EXISTS noderest;

CREATE TABLE IF NOT EXISTS `noderest`.`teams` (
  `team_id` INT NOT NULL AUTO_INCREMENT,
  `team_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`team_id`));

INSERT INTO `noderest`.`teams` (`team_id`, `team_name`) VALUES
('5', 'Brazil'),
('6', 'Portugal'),
('7', 'Argentina'),
('8', 'Germany');

CREATE TABLE `noderest`.`players` (
  `player_id` INT NOT NULL AUTO_INCREMENT,
  `player_name` VARCHAR(45) NOT NULL,
  `position` VARCHAR(45) NOT NULL,
  `DoJ` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `team_id` INT NOT NULL,
  PRIMARY KEY (`player_id`));

  INSERT INTO `noderest`.`players` (`player_id`, `player_name`, `position`, `team_id`) VALUES
  ('3','Abra', 'Def', '4'),
('4', 'Dabra', 'MidF', '1');
