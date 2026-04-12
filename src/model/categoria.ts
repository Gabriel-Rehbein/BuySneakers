import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tenis } from "./tenis";

@Entity("categorias")
export class Categoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nome!: string;

  @Column({ length: 255, nullable: true })
  descricao?: string;

  @OneToMany(() => Tenis, (tenis) => tenis.categoria)
  tenis!: Tenis[];
}