import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Categoria } from "./categoria";

@Entity("tenis")
export class Tenis {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  nome!: string;

  @Column({ length: 80 })
  marca!: string;

  @Column({ length: 30 })
  cor!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  preco!: number;

  @Column("int")
  tamanho!: number;

  @Column("int")
  estoque!: number;

  @Column({ name: "imagem_url", length: 255, nullable: true })
  imagemUrl?: string;
  
  @ManyToOne(() => Categoria, (categoria) => categoria.tenis, {
    eager: true,
    nullable: false,
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "categoria_id" })
  categoria!: Categoria;
}