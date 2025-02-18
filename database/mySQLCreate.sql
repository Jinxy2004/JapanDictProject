-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema JMDICT
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema JMDICT
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `JMDICT` DEFAULT CHARACTER SET utf8 ;
USE `JMDICT` ;

-- -----------------------------------------------------
-- Table `JMDICT`.`entries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`entries` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ent_seq` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ent_seq_UNIQUE` (`ent_seq` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`reading_elements`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`reading_elements` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reading` VARCHAR(255) NULL,
  `nokanji` TINYINT NULL,
  `entries_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_reading_elements_entries1_idx` (`entries_id` ASC) VISIBLE,
  CONSTRAINT `fk_reading_elements_entries1`
    FOREIGN KEY (`entries_id`)
    REFERENCES `JMDICT`.`entries` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`kanji_elements`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`kanji_elements` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `keb_element` VARCHAR(255) NULL,
  `entries_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_kanji_elements_entries1_idx` (`entries_id` ASC) VISIBLE,
  CONSTRAINT `fk_kanji_elements_entries1`
    FOREIGN KEY (`entries_id`)
    REFERENCES `JMDICT`.`entries` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`senses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`senses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `entries_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_senses_entries1_idx` (`entries_id` ASC) VISIBLE,
  CONSTRAINT `fk_senses_entries1`
    FOREIGN KEY (`entries_id`)
    REFERENCES `JMDICT`.`entries` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`kanji_infos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`kanji_infos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ke_info` VARCHAR(255) NULL,
  `kanji_elements_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_kanji_infos_kanji_elements1_idx` (`kanji_elements_id` ASC) VISIBLE,
  CONSTRAINT `fk_kanji_infos_kanji_elements1`
    FOREIGN KEY (`kanji_elements_id`)
    REFERENCES `JMDICT`.`kanji_elements` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`kanji_priority`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`kanji_priority` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ke_priority_info` VARCHAR(255) NULL,
  `kanji_elements_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_kanji_priority_kanji_elements1_idx` (`kanji_elements_id` ASC) VISIBLE,
  CONSTRAINT `fk_kanji_priority_kanji_elements1`
    FOREIGN KEY (`kanji_elements_id`)
    REFERENCES `JMDICT`.`kanji_elements` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`readings_restricted`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`readings_restricted` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `restricted_readings` VARCHAR(255) NULL,
  `reading_elements_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_readings_restricted_reading_elements1_idx` (`reading_elements_id` ASC) VISIBLE,
  CONSTRAINT `fk_readings_restricted_reading_elements1`
    FOREIGN KEY (`reading_elements_id`)
    REFERENCES `JMDICT`.`reading_elements` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`readings_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`readings_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `specific_info` VARCHAR(255) NULL,
  `reading_elements_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_readings_info_reading_elements1_idx` (`reading_elements_id` ASC) VISIBLE,
  CONSTRAINT `fk_readings_info_reading_elements1`
    FOREIGN KEY (`reading_elements_id`)
    REFERENCES `JMDICT`.`reading_elements` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`readings_priority`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`readings_priority` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `re_priority_info` VARCHAR(255) NULL,
  `reading_elements_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_readings_priority_reading_elements1_idx` (`reading_elements_id` ASC) VISIBLE,
  CONSTRAINT `fk_readings_priority_reading_elements1`
    FOREIGN KEY (`reading_elements_id`)
    REFERENCES `JMDICT`.`reading_elements` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`stagk`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`stagk` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `kanjis_restricted_to` VARCHAR(255) NULL,
  `senses_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_stagk_senses1_idx` (`senses_id` ASC) VISIBLE,
  CONSTRAINT `fk_stagk_senses1`
    FOREIGN KEY (`senses_id`)
    REFERENCES `JMDICT`.`senses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`stagr`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`stagr` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `readings_restricted_to` VARCHAR(255) NULL,
  `senses_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_xrefs_senses1_idx` (`senses_id` ASC) VISIBLE,
  CONSTRAINT `fk_xrefs_senses1`
    FOREIGN KEY (`senses_id`)
    REFERENCES `JMDICT`.`senses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`parts_of_speech`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`parts_of_speech` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pos_text` VARCHAR(255) NULL,
  `senses_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_parts_of_speech_senses1_idx` (`senses_id` ASC) VISIBLE,
  CONSTRAINT `fk_parts_of_speech_senses1`
    FOREIGN KEY (`senses_id`)
    REFERENCES `JMDICT`.`senses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`xreferences`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`xreferences` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cross_reference` VARCHAR(255) NULL,
  `senses_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_xreferences_senses1_idx` (`senses_id` ASC) VISIBLE,
  CONSTRAINT `fk_xreferences_senses1`
    FOREIGN KEY (`senses_id`)
    REFERENCES `JMDICT`.`senses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`antonyms`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`antonyms` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ant_reference` VARCHAR(255) NULL,
  `senses_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_antonyms_senses1_idx` (`senses_id` ASC) VISIBLE,
  CONSTRAINT `fk_antonyms_senses1`
    FOREIGN KEY (`senses_id`)
    REFERENCES `JMDICT`.`senses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`field`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`field` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `field_info` VARCHAR(255) NULL,
  `senses_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_field_senses1_idx` (`senses_id` ASC) VISIBLE,
  CONSTRAINT `fk_field_senses1`
    FOREIGN KEY (`senses_id`)
    REFERENCES `JMDICT`.`senses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`misc`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`misc` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `misc_info` VARCHAR(255) NULL,
  `senses_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_misc_senses1_idx` (`senses_id` ASC) VISIBLE,
  CONSTRAINT `fk_misc_senses1`
    FOREIGN KEY (`senses_id`)
    REFERENCES `JMDICT`.`senses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`loanword_source`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`loanword_source` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `l_source` VARCHAR(255) NULL,
  `senses_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_loanword_source_senses1_idx` (`senses_id` ASC) VISIBLE,
  CONSTRAINT `fk_loanword_source_senses1`
    FOREIGN KEY (`senses_id`)
    REFERENCES `JMDICT`.`senses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`sense_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`sense_info` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `extra_info` VARCHAR(255) NULL,
  `senses_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_sense_info_senses1_idx` (`senses_id` ASC) VISIBLE,
  CONSTRAINT `fk_sense_info_senses1`
    FOREIGN KEY (`senses_id`)
    REFERENCES `JMDICT`.`senses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`dialect`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`dialect` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dialect_info` VARCHAR(255) NULL,
  `senses_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_dialect_senses1_idx` (`senses_id` ASC) VISIBLE,
  CONSTRAINT `fk_dialect_senses1`
    FOREIGN KEY (`senses_id`)
    REFERENCES `JMDICT`.`senses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`gloss`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`gloss` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `word_info` VARCHAR(255) NULL,
  `senses_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_gloss_senses1_idx` (`senses_id` ASC) VISIBLE,
  CONSTRAINT `fk_gloss_senses1`
    FOREIGN KEY (`senses_id`)
    REFERENCES `JMDICT`.`senses` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`kanji`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`kanji` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `literal` CHAR(1) NULL,
  `unicode_value` VARCHAR(10) NULL,
  `radical_num` SMALLINT(3) NULL,
  `grade_learned` VARCHAR(10) NULL,
  `stroke_count` TINYINT(3) NULL,
  `app_frequency` TINYINT(4) NULL,
  `rad_name` VARCHAR(45) NULL,
  `JLPT_level` TINYINT(1) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `JMDICT`.`kanji_readings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `JMDICT`.`kanji_readings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reading_type` ENUM('onyomi', 'kunyomi') NULL,
  `reading` VARCHAR(255) NULL,
  `kanji_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_kanji_readings_kanji1_idx` (`kanji_id` ASC) VISIBLE,
  CONSTRAINT `fk_kanji_readings_kanji1`
    FOREIGN KEY (`kanji_id`)
    REFERENCES `JMDICT`.`kanji` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
