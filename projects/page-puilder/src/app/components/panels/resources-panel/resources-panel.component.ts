import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Upload, Trash2, Folder } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { BuilderService } from '../../../core/services/builder.service';
import { Resource } from '../../../core/models/builder.models';

@Component({
  selector: 'app-resources-panel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './resources-panel.component.html',
  styleUrls: ['./resources-panel.component.scss']
})
export class ResourcesPanelComponent implements OnInit, OnDestroy {
  Upload = Upload;
  Trash2 = Trash2;
  Folder = Folder;
  resources: Resource[] = [];
  private subscription = new Subscription();

  constructor(private builderService: BuilderService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.builderService.getResources().subscribe((resources: Resource[]) => {
        this.resources = resources;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const resource: Resource = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: url,
          uploadedAt: new Date()
        };
        this.builderService.addResource(resource);
      };
      reader.readAsDataURL(file);
    });
  }

  deleteResource(id: string): void {
    this.builderService.deleteResource(id);
  }
}
